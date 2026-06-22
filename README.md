# AsideMe — Real-Time AI Class & Certification-Prep Assistant

AsideMe is a full-featured AI coaching assistant that listens to live software engineering classes, generates smart responses students can say out loud, and indexes course materials for RAG-powered teaching.

## Features

### 🎤 Real-Time Speech Recognition
- **7 STT Providers** — choose your own: Deepgram, Google Cloud, AWS Transcribe, Azure Speech, OpenAI Whisper, Google Plugin, or Browser Speech API
- **Provider Agnostic** — swap providers with one env var, no code changes
- **Streaming Transcription** — see partial results as the teacher speaks
- **Speaker Diarization** — identify who's talking (teacher vs. student)

### 🤖 AI-Generated Responses
- Generates smart, natural things students can **say out loud** in class
- NOT reading mode — responses are timed perfectly for classroom participation
- Pulls from:
  - **Course Materials** — indexed PDFs, slides, markdown, code samples
  - **Session History** — remembers what was covered earlier
  - **Real-Time Web Search** — finds current docs, npm packages, MDN articles
  - **Claude Haiku 4.5** — ultra-fast inference (< 1s per response)

### 📚 Knowledge Base Management
- **Automatic Indexing** — drop PDFs, images, code files, and AsideMe indexes them with Claude Vision
- **Smart RAG** — retrieves only relevant context from docs + session history
- **Web Integration** — auto-fetch and index URLs mentioned in class (npm, GitHub, MDN, etc.)

### 📊 Study Tools
- **Quiz Generator** — auto-generate quizzes from indexed material
- **Flashcards** — spaced repetition for key concepts
- **Topic Summary** — extract vocabulary, key concepts, exercises
- **Topic Detection** — AsideMe knows what unit/topic is being taught

### 💾 Session Management
- **Auto-Title** — generates session names after 6+ Q&As
- **Live Stats** — track answered questions, response time, topics covered
- **Export to Markdown** — one-click export of entire session
- **Export to Notion** — sync sessions directly to Notion workspace
- **Auto-Cleanup** — keeps last 30 days of sessions, deletes old ones

### 🔐 Production-Ready
- **Rate Limiting** — prevents abuse on chat (30/min), upload (20/min), quiz (15/min)
- **Session Isolation** — each teacher gets their own session with private context
- **Error Handling** — graceful fallbacks for provider outages
- **Nightly Cleanup** — automatic deletion of old sessions

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure STT Provider
```bash
cp .env.example .env
```

Edit `.env` and choose **ONE** provider (recommended: Deepgram for best accuracy):

```bash
# -- Option 1: Deepgram (simplest, fastest) --
TRANSCRIPTION_PROVIDER=deepgram
DEEPGRAM_API_KEY=your-deepgram-key-here

# -- Option 2: Google Cloud --
# TRANSCRIPTION_PROVIDER=google
# GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
# GOOGLE_PROJECT_ID=your-project

# -- Option 3: AWS Transcribe --
# TRANSCRIPTION_PROVIDER=aws
# AWS_ACCESS_KEY_ID=...
# AWS_SECRET_ACCESS_KEY=...

# -- Option 4: Azure Speech --
# TRANSCRIPTION_PROVIDER=azure
# AZURE_SPEECH_KEY=...
# AZURE_SPEECH_REGION=eastus

# -- Option 5: OpenAI Whisper --
# TRANSCRIPTION_PROVIDER=whisper
# OPENAI_API_KEY=sk-...

# -- Option 6: Google Chrome Plugin (no API key) --
# TRANSCRIPTION_PROVIDER=google-plugin

# -- Option 7: Browser Web Speech API (no API key, basic) --
# TRANSCRIPTION_PROVIDER=browser
```

### 3. Get Your API Keys

| Provider | Setup Time | Cost | Free Tier |
|----------|-----------|------|-----------|
| **Deepgram** | 2 min | Pay-as-you-go | 600 min/month free |
| **Google Cloud** | 10 min | $0.006–0.03/min | 60 min free/month |
| **AWS Transcribe** | 10 min | $0.0001 per 15s | Free tier available |
| **Azure Speech** | 10 min | $1–2.50 per hr | Free tier available |
| **OpenAI Whisper** | 2 min | $0.02/min of audio | Need API key |
| **Google Plugin** | 20 min | Free | Requires Chrome extension setup |
| **Browser** | 0 min | Free | Built-in, basic accuracy |

### 4. Add Anthropic API Key
```bash
# Add to .env
ANTHROPIC_API_KEY=sk-ant-...
```

Get key from: https://console.anthropic.com/

### 5. (Optional) Notion Export
```bash
# Add to .env if you want to sync sessions to Notion
NOTION_API_KEY=ntn_...
NOTION_DATABASE_ID=...
```

### 6. Start the Server
```bash
npm start
```

Expected output:
```
⚡  DevListen v3.1 → http://localhost:3001

✓ Provider ready: deepgram
📚  203 docs ready in RAG
```

### 7. Open in Browser
```bash
open http://localhost:3001
```

Click the microphone button and start speaking! 🎤

---

## Architecture

### Core Components

```
Frontend (public/index.html)
  ↓
  ├─ Microphone capture (audio streaming)
  └─ SSE listener (real-time responses)

server.js (Express + WebSocket)
  ├─ /api/chat (SSE endpoint — generates responses via Claude)
  ├─ /transcribe (WebSocket — audio ↔ STT provider)
  ├─ /api/docs (knowledge base stats)
  ├─ /api/quiz, /api/summary (study tools)
  └─ /api/session (session management + export)

transcription-provider.js (STT abstraction)
  ├─ createDeepgramConnection()
  ├─ createGoogleConnection()
  ├─ createAwsConnection()
  ├─ createAzureConnection()
  ├─ createWhisperConnection()
  ├─ createGooglePluginConnection()
  └─ createBrowserFallback()

rag.js (Retrieval-Augmented Generation)
  ├─ getRelevantContext() — RAG search
  └─ isDuplicate() — avoid repeat answers

classifier.js (Question quality)
  ├─ classify() — filter off-topic questions
  └─ extractTags() — auto-tag answers

ingest.js (Knowledge base)
  ├─ ingestFile() — parse + index documents
  ├─ ingestDirectory() — bulk indexing
  └─ Vision API for images/PDFs

db.js (SQLite)
  ├─ Session CRUD
  ├─ Message storage
  ├─ Transcript archiving
  └─ Auto-cleanup

quiz.js (Study tools)
  ├─ generateQuiz()
  ├─ generateFlashcards()
  └─ summarizeTopic()
```

### Data Flow — Speaking in Class

```
Teacher speaks
  ↓
Deepgram (or other STT) streams transcript
  ↓
JavaScript: silenceTimer detects 1-2s pause
  ↓
POST /api/chat with transcript + session context
  ↓
Claude Haiku 4.5 generates response (via SSE)
  ↓
Events stream to frontend:
  - status: classifying (filter off-topic)
  - status: answering (search RAG)
  - tokens (streaming response)
  - done (finalize QA block + update stats)
  - followups (if additional suggestions available)
  ↓
Frontend renders response → student reads it out loud
  ↓
Repeat
```

---

## Project Structure

```
devlisten-v3/
├── server.js                    # Main server + WebSocket + SSE endpoints
├── public/index.html            # Single-page app (styles + logic, 2745 lines)
│
├── Database & Storage
│   ├── db.js                    # SQLite sessions & messages
│   └── devlisten.db             # Auto-created on first run
│
├── AI & Knowledge
│   ├── rag.js                   # Document retrieval + duplicate detection
│   ├── classifier.js            # Topic detection + off-topic filtering
│   ├── quiz.js                  # Quiz/flashcard/summary generation
│   ├── websearch.js             # Real-time web search
│   └── ingest.js                # Document indexing (PDFs, images, markdown)
│
├── Audio & Transcription
│   ├── transcription-provider.js # STT abstraction (7 providers)
│   └── vocab.js                 # Deepgram keyword hints
│
├── Content
│   ├── teacher-docs/            # Course materials (auto-indexed on startup)
│   └── ingested/                # User-uploaded files / indexed cache
│
├── Config
│   ├── .env                     # API keys, model selection
│   └── .env.example             # Template with all options
│
└── Scripts
    ├── png-to-md.js             # Convert PNG slides to markdown
    ├── bulk-ingest.js           # Batch index documents
    └── export.js                # Export sessions
```

---

## Configuration

### Environment Variables

#### Core API Keys
```bash
ANTHROPIC_API_KEY=sk-ant-...     # Required — Claude responses
DEEPGRAM_API_KEY=...              # Required if using Deepgram

# Notion export (optional)
NOTION_API_KEY=ntn_...
NOTION_DATABASE_ID=...

# STT provider selection (default: deepgram)
TRANSCRIPTION_PROVIDER=deepgram
```

#### Session Management
```bash
SESSION_MAX_MESSAGES=60            # Max Q&A pairs to store
SESSION_CLEANUP_DAYS=30            # Delete sessions older than this
```

#### Server
```bash
PORT=3001                          # Server port
```

See `.env.example` for all options + setup instructions.

---

## Usage Examples

### Automatic Indexing on Startup
AsideMe auto-indexes `teacher-docs/` when the server starts:

```bash
teacher-docs/
  ├─ units/
  │   ├─ 01-fundamentals.md
  │   ├─ 02-async-await.pdf
  │   └─ 03-react/
  │       └─ hooks.png
```

These 203 docs are now searchable by the AI when answering.

### Upload During Session
1. Click **⬆ Upload** in the UI
2. Drop a PDF, image, or code file (`.md`, `.pdf`, `.js`, `.py`, `.sql`, `.json`, `.txt`, `.png`, `.jpg`)
3. Claude Vision automatically extracts content
4. Document is indexed into RAG within seconds

### Answering Questions in Class
1. **Click the microphone** or **hold Space** to start recording
2. Say your question naturally
3. Release to send
4. AsideMe listens to the teacher, understands context, and streams a response
5. Read the response aloud in class

### Generate Quiz
1. Click **📝 Quiz me**
2. Pick a topic (auto-detected from indexed material)
3. AsideMe generates 5 auto-graded questions
4. See explanations for wrong answers

### Export to Notion
1. Click **↗ Notion** after a session
2. AsideMe syncs the entire Q&A and transcript to your Notion workspace
3. Auto-tagged with topics and response times

### Switch STT Providers
```bash
# Edit .env and change:
TRANSCRIPTION_PROVIDER=whisper

# Restart:
npm start
```

No code changes needed — provider switching is seamless.

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/session` | Create new session |
| GET | `/api/docs` | Get indexed docs count & topics |
| POST | `/api/message` | Add question to session |
| GET | `/api/messages/:id` | Get all Q&A pairs |
| POST | `/api/ingest` | Upload & index files |
| POST | `/api/quiz` | Generate quiz |
| POST | `/api/export/markdown` | Export session |
| WS | `/transcribe` | Real-time speech-to-text |

### WebSocket Events

Real-time transcription via `/transcribe`:

```json
{
  "type": "interim",
  "transcript": "What is a closure in JavaScr...",
  "speaker": 0
}
```

```json
{
  "type": "final",
  "transcript": "What is a closure in JavaScript?",
  "speaker": 0
}
```

```json
{
  "type": "utterance_end"
}
```

---

## System Prompt

AsideMe generates responses using this instruction:

> You are a real-time coaching assistant listening to a live software engineering class.
> Your ONLY job is to generate a smart, natural response that the STUDENT can say out loud.
> VOICE & TONE: First person, natural spoken cadence, 1–3 sentences max, mirror teacher's vocabulary.
> KNOWLEDGE PRIORITY: 1) Course material, 2) Web search results, 3) Your own knowledge.

[See HANDOFF.md for full prompt details]

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **SPACE** (hold) | Push-to-ask mode |
| **D** | Dismiss last answer |
| **?** | Show keyboard shortcuts |
| **ESC** | Close modal |

---

## Transcription Options

### Built-in (Default)
- Uses browser Web Speech API
- No API keys needed
- Captures room audio only
- Good for testing

### Deepgram (Recommended)
- Set `DEEPGRAM_API_KEY` in `.env`
- Server auto-detects and uses Deepgram WebSocket
- Much higher accuracy
- Falls back to Web Speech if configured incorrectly

### BlackHole (macOS only)
- Captures audio directly from Zoom
- Requires installation: see app's BlackHole setup guide
- Best for recording calls without ambient noise

---

## Development

### Watch Mode (auto-restart)
```bash
npm run dev          # Auto-restarts on file changes (nodemon)
```

### Ingest Course Materials
```bash
npm run ingest          # Auto-ingest teacher-docs + ingested/
npm run ingest:slides   # Index slide folder
npm run ingest:week1    # Ingest specific folder
npm run convert:all     # Convert PNG slides to markdown first
```

### Check Indexed Docs
```bash
npm run stats     # Count docs + topics
npm run list      # List all docs
```

---

## Production Deployment

### Recommended Setup
1. Use **Deepgram** or **Google Cloud** for accuracy
2. Store API keys in **AWS Secrets Manager** or **Azure Key Vault**
3. Deploy on **Railway**, **Vercel**, **Fly.io**, or your own VPS
4. Enable rate limiting (already in place)
5. Set `SESSION_CLEANUP_DAYS` to keep database size down

### Environment
```bash
NODE_ENV=production
PORT=3001
TRANSCRIPTION_PROVIDER=deepgram  # Choose one stable provider
```

### Database Backup
```bash
# Backup SQLite DB regularly
cp devlisten.db devlisten-$(date +%Y%m%d).db.bak
```

---

## Performance

- **Response Time**: ~1–3 seconds (Claude API)
- **DB Size**: ~1MB per 100 sessions
- **Memory**: ~80MB baseline (Node + SQLite)
- **Connections**: 1 WebSocket per client

## Rate Limiting

Endpoints have built-in rate limits:
- **Chat**: 30 requests/min
- **Ingest**: 20 uploads/min
- **Quiz**: 15 requests/min
- **Localhost exemption**: 127.0.0.1, ::1 bypass limits

## Export Options

### Markdown
- Exports full session transcript with Q&A pairs and timestamps
- Preserves formatting — suitable for archives

### Notion
- Exports to configured Notion database (one entry per session)
- Includes session metadata (stats, tags)
- Requires API credentials

---

## Architecture Decisions

### Why Haiku?
- Ultra-fast inference (< 1s response time)
- Cheap (~$0.80 per 1M input tokens)
- Perfect for real-time classroom interaction
- Switches to larger models if needed for complex questions

### Why SQLite?
- Embedded — zero ops, backup with one command
- Perfect for single-server deployment
- Supports full-text search + vector similarity
- Sessions can be exported anytime

### Why WebSocket + SSE?
- WebSocket: bidirectional audio streaming to STT provider
- SSE: unidirectional response streaming (simpler, lower latency than WebSocket for server → client)
- Combination gives best of both worlds

### Why Multiple STT Providers?
- No vendor lock-in
- Teachers choose based on accuracy + cost
- Fallback if one provider is down
- Easy migration between providers

---

## Troubleshooting

### "Cannot connect to microphone"
- Check browser permissions (allow microphone)
- Try `TRANSCRIPTION_PROVIDER=browser` (no API key needed)

### "Missing API key" / API key errors
- `cp .env.example .env`
- Add your key to `DEEPGRAM_API_KEY=` and `ANTHROPIC_API_KEY=`
- Verify it's set: `echo $ANTHROPIC_API_KEY`
- Restart: `npm start`

### "No docs indexed" / documents not indexing
- Check `teacher-docs/` exists and has files: `ls -la teacher-docs/`
- Manually ingest: `npm run ingest`
- Check console / `npm run stats` for parsing errors

### "Server won't start"
```bash
# Check if port 3001 is in use
lsof -i :3001
# Kill existing process
pkill -f "node server.js"
```

### "SSE connection drops"
- Check DevTools Network tab for errors
- Verify `ANTHROPIC_API_KEY` is valid
- Check rate limits (30 questions/min)

### Scrolling issues
- All content areas should scroll; check that modals display full content
- Refresh browser if UI seems stuck

### "Provider not working"
- See `transcription-provider.js` for detailed setup per provider

---

## What's New in v3

✅ **All 7 STT Providers** fully integrated (v2 had only Deepgram)  
✅ **Provider-agnostic architecture** (swap with one env var)  
✅ **Real-time web search** for current documentation  
✅ **Google Plugin support** for direct transcript injection  
✅ **Full test coverage** of RAG + classifier  
✅ **Production rate limiting** on all endpoints  
✅ **Auto session cleanup** (configurable retention)  
✅ **Notion export** for note-taking integration  

---

## Next Developer?

See **[HANDOFF.md](./HANDOFF.md)** for:
- Complete architecture overview
- Implementation details
- Recent changes (March 2026)
- Known issues & next steps
- Deployment checklist
- Troubleshooting guide

---

## License

Proprietary — AsideMe. All rights reserved.

## Support

- **Documentation** → See detailed comments in each `.js` file, plus HANDOFF.md
- **Deepgram Docs** → https://developers.deepgram.com/docs/
- **Google Cloud STT** → https://cloud.google.com/speech-to-text/v2/docs
- **AWS Transcribe** → https://docs.aws.amazon.com/transcribe/latest/dg/
- **Claude API** → https://docs.anthropic.com/

---

**Status**: Production-ready ✅  
**Last Updated**: March 24, 2026  
**Version**: 3.1.0
