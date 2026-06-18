# ASIDE — Real-Time AI Tutor for Live Classes

ASIDE is a full-featured AI coaching assistant that listens to live software engineering classes, generates smart responses students can say out loud, and indexes course materials for RAG-powered teaching.

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
- **Automatic Indexing** — drop PDFs, images, code files, and ASIDE indexes them with Claude Vision
- **Smart RAG** — retrieves only relevant context from docs + session history
- **Web Integration** — auto-fetch and index URLs mentioned in class (npm, GitHub, MDN, etc.)

### 📊 Study Tools
- **Quiz Generator** — auto-generate quizzes from indexed material
- **Flashcards** — spaced repetition for key concepts
- **Topic Summary** — extract vocabulary, key concepts, exercises
- **Topic Detection** — ASIDE knows what unit/topic is being taught

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
⚡  ASIDE v3.1 → http://localhost:3001

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

## Files

### Core
- `server.js` — Express server + WebSocket + SSE endpoints
- `transcription-provider.js` — STT abstraction (7 providers)
- `db.js` — SQLite database (sessions, messages, transcripts)
- `rag.js` — Vector search + duplicate detection
- `ingest.js` — Document ingestion (PDFs, images, markdown)
- `classifier.js` — Question classification + off-topic filtering

### Learning Tools
- `quiz.js` — Quiz + flashcard + summary generation
- `vocab.js` — Deepgram keyword hints
- `websearch.js` — Real-time web search integration

### Frontend
- `public/index.html` — Full single-page app (styles + logic)

### Data
- `.env` — Configuration (API keys, model selection)
- `.env.example` — Template with all options
- `teacher-docs/` — Your course materials (auto-indexed on startup)
- `ingested/` — User-uploaded files
- `devlisten.db` — SQLite database (sessions + messages)

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
ASIDE auto-indexes `teacher-docs/` when the server starts:

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
2. Drop a PDF, image, or code file
3. Claude Vision automatically extracts content
4. Document is indexed into RAG within seconds

### Generate Quiz
1. Click **📝 Quiz me**
2. Pick a topic (auto-detected from indexed material)
3. ASIDE generates 5 auto-graded questions
4. See explanations for wrong answers

### Export to Notion
1. Click **↗ Notion** after a session
2. ASIDE syncs the entire Q&A and transcript to your Notion workspace
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

## Troubleshooting

### "Cannot connect to microphone"
- Check browser permissions (allow microphone)
- Try `TRANSCRIPTION_PROVIDER=browser` (no API key needed)

### "Missing API key for Deepgram"
- `cp .env.example .env`
- Add your key to `DEEPGRAM_API_KEY=`
- Restart: `npm start`

### "No docs indexed"
- Check `teacher-docs/` exists and has files
- Manually ingest: `npm run ingest`
- See console for parsing errors

### "SSE connection drops"
- Check DevTools Network tab for errors
- Verify `ANTHROPIC_API_KEY` is valid
- Check rate limits (30 questions/min)

### "Provider not working"
See `transcription-provider.js` for detailed setup per provider.

---

## Development

### Watch Mode (auto-restart)
```bash
npm run dev
```

### Ingest Course Materials
```bash
# Auto-ingest teacher-docs + ingested/
npm run ingest

# Ingest specific folder
npm run ingest:week1
```

### Check Indexed Docs
```bash
npm run stats     # Count docs + topics
npm run list      # List all docs
```

### View Database
```bash
# Use any SQLite client (e.g., sqlite-web, VS Code SQLite extension)
open devlisten.db
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

## License

MIT

---

## Support

- **Documentation** → See detailed comments in each `.js` file
- **Deepgram Docs** → https://developers.deepgram.com/docs/
- **Google Cloud STT** → https://cloud.google.com/speech-to-text/v2/docs
- **AWS Transcribe** → https://docs.aws.amazon.com/transcribe/latest/dg/
- **Claude API** → https://docs.anthropic.com/

---

## Author

Built for real-time AI-powered teaching.

Made with ⚡ for teachers and students who get it.

### 📝 Study Tools
- **Quiz**: Auto-generated from indexed materials
- **Flashcards**: Flip-card study with navigation
- **Summary**: Topic-based lesson summaries

### 📊 Session Management
- All Q&A stored in SQLite
- Session stats: answered count, filtered count, avg response time
- Export to Markdown or Notion
- Tag-based filtering

## Architecture

```
Browser (WebSocket)  →  Express Server  →  Claude API
    ↓                         ↓                ↓
Microphone Input        Session/Messages   RAG Context
                         Web Search         Web Search
```

## Project Structure

```
devlisten-v3/
├── server.js                    # Main server + WebSocket
├── public/index.html            # Single-page app (2745 lines)
│
├── Database & Storage
│   ├── db.js                    # SQLite sessions & messages
│   └── devlisten.db             # Auto-created on first run
│
├── AI & Knowledge
│   ├── rag.js                   # Document retrieval
│   ├── classifier.js            # Topic detection
│   ├── quiz.js                  # Quiz/flashcard generation
│   ├── websearch.js             # Real-time web search
│   └── ingest.js                # Document indexing
│
├── Audio & Transcription
│   ├── transcription-provider.js # Deepgram integration
│   └── vocab.js                 # Deepgram keywords
│
├── Content
│   ├── teacher-docs/            # Course materials (tracked in git)
│   └── ingested/                # Indexed docs cache
│
└── Scripts
    ├── png-to-md.js             # Convert PNG slides to markdown
    ├── bulk-ingest.js           # Batch index documents
    └── export.js                # Export sessions
```

## Usage

### Answering Questions in Class
1. **Click the microphone** or **hold Space** to start recording
2. Say your question naturally
3. Release to send
4. ASIDE listens to the teacher, understands context, and streams a response
5. Read the response aloud in class

### Uploading Course Materials
1. Click **"⬆ Upload"** in the left sidebar
2. Drag files or click to browse
3. Supports: `.md`, `.pdf`, `.js`, `.py`, `.sql`, `.json`, `.txt`, `.png`, `.jpg`
4. Claude Vision automatically processes images
5. Materials indexed and searchable

### Study Tools
1. Click **"📝 Quiz me"**, **"🃏 Flashcards"**, or **"📋 Summary"**
2. Select a topic from indexed materials
3. Study tools auto-generate from course content

## Configuration

Create `.env` file in root directory:

```env
# Required
ANTHROPIC_API_KEY=sk-...

# Optional - Enhanced speech recognition
DEEPGRAM_API_KEY=dg_...

# Optional - Export sessions to Notion
NOTION_API_KEY=secret_...
NOTION_DATABASE_ID=...

# Server settings
PORT=3001
SESSION_MAX_MESSAGES=60
```

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

## WebSocket Events

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

## System Prompt

ASIDE generates responses using this instruction:

> You are a real-time coaching assistant listening to a live software engineering class.
> Your ONLY job is to generate a smart, natural response that the STUDENT can say out loud.
> VOICE & TONE: First person, natural spoken cadence, 1–3 sentences max, mirror teacher's vocabulary.
> KNOWLEDGE PRIORITY: 1) Course material, 2) Web search results, 3) Your own knowledge.

[See HANDOFF.md for full prompt details]

## Development

### Start Dev Server
```bash
npm run dev
# Auto-restarts on file changes (nodemon)
```

### Index Documents
```bash
npm run ingest:slides       # Index slide folder
npm run stats               # Show doc statistics
npm run list                # List all indexed docs
npm run convert:all         # Convert PNG slides to markdown first
```

### Build Commands
```bash
npm start                   # Production start (no auto-restart)
npm run stats               # Show indexed docs & topics
npm run list                # List all indexed documents
npm run convert:week1       # Convert specific slides
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **SPACE** (hold) | Push-to-ask mode |
| **D** | Dismiss last answer |
| **?** | Show keyboard shortcuts |
| **ESC** | Close modal |

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

### BlackHole (MacOS only)
- Captures audio directly from Zoom
- Requires installation: See app's BlackHole setup guide
- Best for recording calls without ambient noise

## Troubleshooting

### Server won't start
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill existing process
pkill -f "node server.js"
```

### API key errors
```bash
# Verify ANTHROPIC_API_KEY is set
echo $ANTHROPIC_API_KEY

# Check .env file exists in root
cat .env
```

### Documents not indexing
```bash
# Check ingestion status
npm run stats

# Verify teacher-docs folder exists
ls -la teacher-docs/

# Re-ingest all
npm run ingest:slides
```

### Scrolling issues
- All content areas now properly scroll
- Check that modals display full content
- Refresh browser if UI seems stuck

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
- Exports full session transcript
- Includes Q&A pairs with timestamps
- Preserves formatting
- Suitable for archives

### Notion
- Exports to configured Notion database
- Creates database entries per session
- Includes session metadata (stats, tags)
- Requires API credentials

## Database

**SQLite** (better-sqlite3) stores:
- Sessions (ID, title, created, modified, tags)
- Messages (question, answer, latency, classification)
- Transcripts (speaker, timestamp, text)

Auto-created at: `./devlisten.db`

## Next Developer?

See **[HANDOFF.md](./HANDOFF.md)** for:
- Complete architecture overview
- Implementation details
- Recent changes (March 2026)
- Known issues & next steps
- Deployment checklist
- Troubleshooting guide

## License

Proprietary — ASIDE

## Contact

For questions about this codebase, see HANDOFF.md for detailed implementation notes and development context.

---

**Status**: Production-ready ✅  
**Last Updated**: March 24, 2026  
**Version**: 3.1.0
# devlistenv3
