/**
 * transcription-provider.js — Speech-to-Text Provider Abstraction
 *
 * All providers fully implemented. Switch via TRANSCRIPTION_PROVIDER in .env
 *
 * Providers:
 *   deepgram       — Deepgram Nova-2 (default)
 *   google         — Google Cloud Speech-to-Text v2
 *   google-plugin  — Google Speech via Chrome Extension (browser-side STT)
 *   aws            — AWS Transcribe Streaming
 *   azure          — Azure Cognitive Services Speech
 *   whisper        — OpenAI Whisper API
 *   browser        — Browser Web Speech API fallback
 *
 * Audio format from browser:
 *   Encoding: Linear PCM 16-bit signed integers
 *   Sample rate: 16000 Hz, Mono, ~4096 samples/chunk
 */

import { WebSocket }           from 'ws';
import { createClient }        from '@deepgram/sdk';
import { PassThrough }         from 'stream';
import { DEEPGRAM_KEYWORDS }   from './vocab.js';

export const ACTIVE_PROVIDER = process.env.TRANSCRIPTION_PROVIDER || 'deepgram';

export const PROVIDERS = {
  deepgram:       'Deepgram Nova-2',
  google:         'Google Cloud Speech-to-Text v2',
  'google-plugin':'Google Speech Chrome Plugin',
  aws:            'AWS Transcribe Streaming',
  azure:          'Azure Cognitive Services Speech',
  whisper:        'OpenAI Whisper API',
  browser:        'Browser Web Speech API (Chrome fallback)',
};

export function logProviderStatus() {
  const name = PROVIDERS[ACTIVE_PROVIDER] || ACTIVE_PROVIDER;
  console.log(`\n🎙  STT Provider: ${name}`);
  const checks = {
    deepgram:       () => !process.env.DEEPGRAM_API_KEY   && '⚠  DEEPGRAM_API_KEY not set',
    google:         () => !process.env.GOOGLE_APPLICATION_CREDENTIALS && '⚠  GOOGLE_APPLICATION_CREDENTIALS not set',
    aws:            () => !process.env.AWS_ACCESS_KEY_ID  && '⚠  AWS_ACCESS_KEY_ID not set',
    azure:          () => !process.env.AZURE_SPEECH_KEY   && '⚠  AZURE_SPEECH_KEY not set',
    whisper:        () => !process.env.OPENAI_API_KEY     && '⚠  OPENAI_API_KEY not set',
  };
  const warn = checks[ACTIVE_PROVIDER]?.();
  if (warn) console.warn(warn);
}

export function createProviderConnection(clientWs, config = {}) {
  switch (ACTIVE_PROVIDER) {
    case 'deepgram':      return createDeepgramConnection(clientWs, config);
    case 'google':        return createGoogleConnection(clientWs, config);
    case 'google-plugin': return createGooglePluginConnection(clientWs, config);
    case 'aws':           return createAwsConnection(clientWs, config);
    case 'azure':         return createAzureConnection(clientWs, config);
    case 'whisper':       return createWhisperConnection(clientWs, config);
    case 'browser':       return createBrowserFallback(clientWs);
    default:
      console.warn(`Unknown provider "${ACTIVE_PROVIDER}" — falling back to Deepgram`);
      return createDeepgramConnection(clientWs, config);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPER: safe send to client
// ─────────────────────────────────────────────────────────────────────────────
function send(ws, obj) {
  try {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
  } catch(_) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. DEEPGRAM Nova-2
// ─────────────────────────────────────────────────────────────────────────────
function createDeepgramConnection(clientWs, { apiKey }) {
  const key = apiKey || process.env.DEEPGRAM_API_KEY;
  if (!key) { send(clientWs, { type:'error', message:'DEEPGRAM_API_KEY not set' }); return nullProvider(); }

  const dg = createClient(key);
  let dgConn = null;
  let ready  = false;
  const queue = [];

  const open = async () => {
    try {
      dgConn = dg.listen.live({
        model:            'nova-2',
        language:         'en-US',
        smart_format:     true,
        diarize:          true,
        punctuate:        true,
        interim_results:  true,
        utterance_end_ms: 800,
        vad_events:       true,
        encoding:         'linear16',
        sample_rate:      16000,
        channels:         1,
        keywords:         DEEPGRAM_KEYWORDS,
      });

      dgConn.on('open', () => {
        ready = true;
        queue.forEach(c => dgConn.send(c));
        queue.length = 0;
      });

      dgConn.on('Results', data => {
        const alt = data.channel?.alternatives?.[0];
        if (!alt?.transcript) return;
        send(clientWs, {
          type:       data.is_final ? 'final' : 'interim',
          transcript: alt.transcript,
          speaker:    alt.words?.[0]?.speaker ?? 0,
          confidence: alt.confidence ?? 1,
          words:      alt.words || [],
        });
      });

      dgConn.on('UtteranceEnd', () => send(clientWs, { type: 'utterance_end' }));
      dgConn.on('SpeechStarted', () => send(clientWs, { type: 'speech_started' }));
      dgConn.on('error', err => send(clientWs, { type: 'error', message: err.message }));

    } catch(err) {
      send(clientWs, { type: 'error', message: 'Deepgram: ' + err.message });
    }
  };

  open();

  return {
    send: buf => ready ? dgConn?.send(buf) : queue.push(buf),
    stop: () => { try { dgConn?.requestClose(); } catch(_) {} },
  };
}
// ─────────────────────────────────────────────────────────────────────────────
// 2. GOOGLE CLOUD Speech-to-Text v2
// Install: npm install @google-cloud/speech
// Env:     GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
//          GOOGLE_PROJECT_ID=your-project-id
// ─────────────────────────────────────────────────────────────────────────────
async function createGoogleConnection(clientWs, { sampleRate = 16000, language = 'en-US' }) {
  try {
    const { SpeechClient } = await import('@google-cloud/speech').catch(() => {
      throw new Error('Run: npm install @google-cloud/speech');
    });

    const client = new SpeechClient();

    const streamingConfig = {
      config: {
        encoding:                   'LINEAR16',
        sampleRateHertz:            sampleRate,
        languageCode:               language,
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets:      true,
        enableSpeakerDiarization:   true,
        diarizationConfig: {
          enableSpeakerDiarization: true,
          minSpeakerCount:          1,
          maxSpeakerCount:          4,
        },
        model:         'latest_long',
        useEnhanced:   true,
      },
      interimResults: true,
    };

    const recognizeStream = client
      .streamingRecognize(streamingConfig)
      .on('data', data => {
        const result = data.results?.[0];
        if (!result) return;

        const alt        = result.alternatives?.[0];
        const transcript = alt?.transcript || '';
        if (!transcript) return;

        const isFinal  = result.isFinal;
        const speaker  = alt?.words?.[alt.words.length - 1]?.speakerTag ?? 0;
        const confidence = alt?.confidence ?? 1;

        send(clientWs, {
          type:       isFinal ? 'final' : 'interim',
          transcript, speaker, confidence,
          words: alt?.words?.map(w => ({
            word:    w.word,
            speaker: w.speakerTag ?? 0,
          })) || [],
        });

        if (isFinal) {
          send(clientWs, { type: 'utterance_end' });
        }
      })
      .on('error', err => {
        // Restart on recoverable errors
        if (err.code === 11) { // UNAVAILABLE
          console.warn('Google STT stream restarted');
          createGoogleConnection(clientWs, { sampleRate, language });
        } else {
          send(clientWs, { type: 'error', message: 'Google STT: ' + err.message });
        }
      });

    send(clientWs, { type: 'speech_started' });

    return {
      send: buf => {
        try { recognizeStream.write(Buffer.from(buf)); }
        catch(e) { send(clientWs, { type:'error', message: e.message }); }
      },
      stop: () => { try { recognizeStream.end(); client.close(); } catch(_) {} },
    };

  } catch(err) {
    send(clientWs, { type: 'error', message: err.message });
    return nullProvider();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GOOGLE CHROME PLUGIN (browser-side STT, server is a passthrough)
//
// The Chrome extension captures audio and sends transcripts as text JSON
// directly to the /transcribe WebSocket. This server-side handler normalises
// those messages into ASIDE's standard format.
// ─────────────────────────────────────────────────────────────────────────────
function createGooglePluginConnection(clientWs, config) {
  send(clientWs, {
    type:    'provider_ready',
    provider: 'google-plugin',
    message: 'Waiting for Chrome extension transcript messages',
  });

  return {
    send: () => {}, // No binary audio — plugin handles capture in browser
    stop: () => send(clientWs, { type: 'provider_stopped' }),

    // Called by server.js when a text (non-binary) WS message arrives
    handleTextMessage: (msg) => {
      try {
        const data = typeof msg === 'string' ? JSON.parse(msg) : msg;

        if (data.type === 'transcript') {
          send(clientWs, {
            type:       data.isFinal ? 'final' : 'interim',
            transcript: data.text || '',
            speaker:    data.speaker ?? 0,
            confidence: data.confidence ?? 1,
            words:      [],
          });
          if (data.isFinal) send(clientWs, { type: 'utterance_end' });
        } else if (data.type === 'start') {
          send(clientWs, { type: 'speech_started' });
        }
      } catch(_) {}
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. AWS TRANSCRIBE STREAMING
// Install: npm install @aws-sdk/client-transcribe-streaming
// Env:     AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
// ─────────────────────────────────────────────────────────────────────────────
async function createAwsConnection(clientWs, { sampleRate = 16000, language = 'en-US' }) {
  try {
    const { TranscribeStreamingClient, StartStreamTranscriptionCommand } = await import(
      '@aws-sdk/client-transcribe-streaming'
    ).catch(() => {
      throw new Error('Run: npm install @aws-sdk/client-transcribe-streaming');
    });

    if (!process.env.AWS_ACCESS_KEY_ID) throw new Error('AWS_ACCESS_KEY_ID not set');

    const client = new TranscribeStreamingClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId:     process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // PassThrough stream bridges raw audio chunks to the AWS SDK async iterator
    const audioStream = new PassThrough();
    let   stopped     = false;

    // Build async generator from the PassThrough stream
    async function* audioGenerator() {
      for await (const chunk of audioStream) {
        if (stopped) return;
        yield { AudioEvent: { AudioChunk: chunk } };
      }
    }

    const command = new StartStreamTranscriptionCommand({
      LanguageCode:                       language,
      MediaEncoding:                      'pcm',
      MediaSampleRateHertz:               sampleRate,
      AudioStream:                        audioGenerator(),
      ShowSpeakerLabel:                   true,
      EnablePartialResultsStabilization:  true,
      PartialResultsStability:            'high',
      VocabularyFilterMethod:             'tag',
    });

    // Start transcription — runs concurrently
    client.send(command).then(async ({ TranscriptResultStream }) => {
      try {
        for await (const event of TranscriptResultStream) {
          if (stopped) break;
          const results = event.TranscriptEvent?.Transcript?.Results;
          if (!results?.length) continue;

          const result     = results[0];
          const transcript = result.Alternatives?.[0]?.Transcript || '';
          const isFinal    = !result.IsPartial;
          const words      = result.Alternatives?.[0]?.Items || [];

          // Extract speaker from word-level data
          const speaker = words.find(w => w.Type === 'pronunciation')?.Speaker ?? 0;

          if (transcript) {
            send(clientWs, {
              type: isFinal ? 'final' : 'interim',
              transcript, speaker,
              confidence: result.Alternatives?.[0]?.Confidence ?? 1,
              words: words.filter(w => w.Type === 'pronunciation').map(w => ({
                word: w.Content, speaker: parseInt(w.Speaker || '0'),
              })),
            });
            if (isFinal) send(clientWs, { type: 'utterance_end' });
          }
        }
      } catch(err) {
        if (!stopped) send(clientWs, { type: 'error', message: 'AWS: ' + err.message });
      }
    }).catch(err => {
      send(clientWs, { type: 'error', message: 'AWS start: ' + err.message });
    });

    send(clientWs, { type: 'speech_started' });

    return {
      send: buf => {
        if (!stopped) try { audioStream.push(Buffer.from(buf)); } catch(_) {}
      },
      stop: () => {
        stopped = true;
        try { audioStream.push(null); } catch(_) {} // signal end of stream
        try { client.destroy(); } catch(_) {}
      },
    };

  } catch(err) {
    send(clientWs, { type: 'error', message: err.message });
    return nullProvider();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. AZURE COGNITIVE SERVICES SPEECH
// Install: npm install microsoft-cognitiveservices-speech-sdk
// Env:     AZURE_SPEECH_KEY, AZURE_SPEECH_REGION
// ─────────────────────────────────────────────────────────────────────────────
async function createAzureConnection(clientWs, { sampleRate = 16000, language = 'en-US' }) {
  try {
    const sdk = await import('microsoft-cognitiveservices-speech-sdk').catch(() => {
      throw new Error('Run: npm install microsoft-cognitiveservices-speech-sdk');
    });

    const key    = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION || 'eastus';
    if (!key) throw new Error('AZURE_SPEECH_KEY not set');

    const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
    speechConfig.speechRecognitionLanguage = language;
    speechConfig.enableDictation();
    speechConfig.requestWordLevelTimestamps();
    speechConfig.setServiceProperty(
      'punctuation', 'explicit',
      sdk.ServicePropertyChannel.UriQueryParameter
    );

    // PushAudioInputStream bridges our raw PCM chunks into Azure SDK
    const pushStream  = sdk.AudioInputStream.createPushStream(
      sdk.AudioStreamFormat.getWaveFormatPCM(sampleRate, 16, 1)
    );
    const audioConfig  = sdk.AudioConfig.fromStreamInput(pushStream);
    const recognizer   = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    let silenceTimer = null;

    recognizer.recognizing = (_, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizingSpeech) {
        clearTimeout(silenceTimer);
        send(clientWs, {
          type:       'interim',
          transcript: e.result.text,
          speaker:    0,
          confidence: 1,
          words:      [],
        });
      }
    };

    recognizer.recognized = (_, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech && e.result.text) {
        send(clientWs, {
          type:       'final',
          transcript: e.result.text,
          speaker:    0,
          confidence: e.result.properties?.getProperty('Confidence') ?? 1,
          words:      [],
        });
        // Debounced utterance end — Azure doesn't have a native utterance end event
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => send(clientWs, { type: 'utterance_end' }), 800);
      }
    };

    recognizer.speechStartDetected = () => send(clientWs, { type: 'speech_started' });

    recognizer.canceled = (_, e) => {
      if (e.reason === sdk.CancellationReason.Error) {
        send(clientWs, { type: 'error', message: 'Azure: ' + e.errorDetails });
      }
    };

    recognizer.startContinuousRecognitionAsync(
      () => {}, // success — already signaled via speechStartDetected
      err => send(clientWs, { type: 'error', message: 'Azure start: ' + err })
    );

    return {
      send: buf => {
        try { pushStream.write(Buffer.from(buf)); }
        catch(e) { send(clientWs, { type: 'error', message: e.message }); }
      },
      stop: () => {
        clearTimeout(silenceTimer);
        recognizer.stopContinuousRecognitionAsync(
          () => { try { pushStream.close(); recognizer.close(); } catch(_) {} },
          () => {}
        );
      },
    };

  } catch(err) {
    send(clientWs, { type: 'error', message: err.message });
    return nullProvider();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. OPENAI WHISPER
// Install: npm install openai
// Env:     OPENAI_API_KEY, WHISPER_CHUNK_SECONDS (default: 4)
//
// Whisper is NOT a streaming API — it processes complete audio files.
// We buffer PCM audio into chunks of WHISPER_CHUNK_SECONDS seconds,
// wrap each chunk in a WAV header, and send to the API.
// Results appear with a slight delay equal to chunk duration.
// ─────────────────────────────────────────────────────────────────────────────
async function createWhisperConnection(clientWs, { sampleRate = 16000 }) {
  try {
    const { default: OpenAI } = await import('openai').catch(() => {
      throw new Error('Run: npm install openai');
    });

    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error('OPENAI_API_KEY not set');

    const openai       = new OpenAI({ apiKey: key });
    const chunkSecs    = parseInt(process.env.WHISPER_CHUNK_SECONDS || '4');
    const bytesPerSec  = sampleRate * 2; // 16-bit = 2 bytes per sample
    const chunkSize    = bytesPerSec * chunkSecs;

    let buffer  = Buffer.alloc(0);
    let stopped = false;
    let seqNum  = 0;

    // Whisper processes each chunk — emit interim on start, final on result
    const processChunk = async (audioData) => {
      const seq = ++seqNum;
      try {
        // Signal we're processing
        send(clientWs, { type: 'speech_started' });

        const wavBuffer = addWavHeader(audioData, sampleRate);
        const file      = new File([wavBuffer], `chunk_${seq}.wav`, { type: 'audio/wav' });

        const response = await openai.audio.transcriptions.create({
          file,
          model:       'whisper-1',
          language:    'en',
          response_format: 'verbose_json', // includes word timestamps
          timestamp_granularities: ['word'],
        });

        if (stopped) return;

        const transcript = response.text?.trim();
        if (!transcript) return;

        send(clientWs, {
          type:       'final',
          transcript,
          speaker:    0,
          confidence: 1,
          words:      (response.words || []).map(w => ({
            word:  w.word,
            start: w.start,
            end:   w.end,
          })),
        });

        send(clientWs, { type: 'utterance_end' });

      } catch(err) {
        if (!stopped) send(clientWs, { type: 'error', message: 'Whisper: ' + err.message });
      }
    };

    return {
      send: buf => {
        if (stopped) return;
        buffer = Buffer.concat([buffer, Buffer.from(buf)]);
        // Process when we have a full chunk
        while (buffer.length >= chunkSize) {
          const chunk = buffer.subarray(0, chunkSize);
          buffer      = buffer.subarray(chunkSize);
          processChunk(Buffer.from(chunk));
        }
      },
      stop: () => {
        stopped = true;
        // Process any remaining audio
        if (buffer.length > bytesPerSec * 0.5) { // at least 0.5s of audio
          processChunk(Buffer.from(buffer));
        }
        buffer = Buffer.alloc(0);
      },
    };

  } catch(err) {
    send(clientWs, { type: 'error', message: err.message });
    return nullProvider();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. BROWSER FALLBACK
// No server-side processing — browser handles capture via Web Speech API
// ─────────────────────────────────────────────────────────────────────────────
function createBrowserFallback(clientWs) {
  send(clientWs, {
    type:    'info',
    message: 'Using browser speech recognition — no server-side STT',
  });
  return { send: () => {}, stop: () => {} };
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// Returns a no-op provider so the caller never has to null-check
function nullProvider() {
  return { send: () => {}, stop: () => {} };
}

// Wraps raw PCM data in a minimal WAV file header
// Required for Whisper and other APIs that expect WAV format
function addWavHeader(pcmBuffer, sampleRate = 16000, numChannels = 1, bitsPerSample = 16) {
  const dataSize   = pcmBuffer.length;
  const byteRate   = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const header     = Buffer.alloc(44);

  header.write('RIFF',           0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE',           8);
  header.write('fmt ',          12);
  header.writeUInt32LE(16,      16); // PCM chunk size
  header.writeUInt16LE(1,       20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate,  24);
  header.writeUInt32LE(byteRate,    28);
  header.writeUInt16LE(blockAlign,  32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data',          36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}
