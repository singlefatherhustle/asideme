# AsideMe — Developer Handoff Guide

## Project Overview

**AsideMe** is a real-time AI coaching assistant that listens to live software engineering classes and generates smart, natural responses that students can say aloud to sound knowledgeable and engaged.

**Key Philosophy**: Responses are generated for *spoken delivery*, not silent reading. The system provides direct answers, thoughtful follow-ups, observations, and questions that students can confidently speak in class.

**Version**: 3.1.0  
**Language**: JavaScript (Node.js + Browser)  
**Database**: SQLite (better-sqlite3)  
**AI Model**: Anthropic Claude API  
**Transcription**: Deepgram (primary), Web Speech API fallback

---

## Architecture

```
┌─────────────────────────────────────┐
│     Student Web Browser (WebSocket)  │
│  - Microphone capture                │
│  - Real-time transcript display      │
│  - Q&A feed                          │
│  - Study tools (quiz, flashcards)    │
└──────────────┬──────────────────────┘
               │ WebSocket
               ▼
┌─────────────────────────────────────┐
│     Express.js Server (3001)         │
│  - Session management                │
│  - WebSocket handling                │
│  - API endpoints (/api/*)            │
│  - Static file serving (public/)     │
└──────────────┬──────────────────────┘
               │
      ┌────────┼────────┐
      ▼        ▼        ▼
   ┌────────┬──────────┬─────────┐
   │        │          │         │
   ▼        ▼          ▼         ▼
 Claude  RAG/Docs  Deepgram  Web Search
 API     (SQLite)  (Speech)   (URLs)
```

### Key Components

1. **server.js** - Main Express server, WebSocket handler, API endpoints
2. **db.js** - SQLite session/message storage & query functions
3. **rag.js** - Retrieves relevant course material from indexed docs
4. **classifier.js** - Classifies questions (topic detection)
5. **ingest.js** - Processes and indexes documents (Claude Vision for images)
6. **websearch.js** - Real-time web search and URL content extraction
7. **quiz.js** - Quiz/flashcard/summary generation via Claude
8. **vocab.js** - Deepgram keyword configuration
9. **public/index.html** - Full-featured single-page application
10. **transcription-provider.js** - Deepgram integration (if available)

---

## Setup & Installation

### Prerequisites
- Node.js 18+ (tested on Node 24.12.0)
- npm or yarn
- macOS (for BlackHole audio routing)

### Environment Variables
Create a `.env` file in the root:

```env
# API Keys
ANTHROPIC_API_KEY=sk-...
DEEPGRAM_API_KEY=dg_...  # Optional for enhanced speech recognition
NOTION_API_KEY=secret_...  # Optional for Notion export
NOTION_DATABASE_ID=...     # Optional for Notion export

# Server
PORT=3001

# Session Settings
SESSION_MAX_MESSAGES=60

# Web Search (Optional)
# Automatically detects URLs mentioned in questions
```

### Installation

```bash
# Install dependencies
npm install

# Start development server (auto-restart on file changes)
npm run dev

# Or production start
npm start
```

**Server runs at**: `http://localhost:3001`

---

## File Structure

```
devlisten-v3/
├── server.js                    # Main Express + WebSocket server
├── db.js                        # SQLite database & queries
├── rag.js                       # RAG context retrieval
├── classifier.js                # Topic classification
├── ingest.js                    # Document ingestion & indexing
├── websearch.js                 # Web search integration
├── quiz.js                      # Quiz/flashcard/summary generation
├── vocab.js                     # Deepgram keywords
├── transcription-provider.js    # Deepgram setup
├── png-to-md.js                 # Slide image → markdown converter
├── bulk-ingest.js               # Batch document ingestion
├── export.js                    # Session export (Markdown, Notion)
│
├── public/
│   ├── index.html               # Single-page app (2745 lines)
│   │   ├── Microphone panel
│   │   ├── Live transcript
│   │   ├── Knowledge base (docs count, topics)
│   │   ├── Session stats
│   │   ├── Q&A feed (right panel)
│   │   ├── Upload modal
│   │   ├── Study modal (quiz, flashcards, summary)
│   │   └── Shortcuts modal
│   │
│   └── client-side JavaScript
│       ├── WebSocket connection
│       ├── Microphone/audio handling
│       ├── Modal management
│       ├── Feed rendering
│       └── Study tools UI
│
├── teacher-docs/                # Git-tracked course materials
│   ├── units/01-frontend_foundations/
│   ├── units/03-frontend_development/
│   ├── units/04-frontend_libraries/
│   ├── units/06-backend_development/
│   ├── units/08-data_structures_algorithms/
│   └── extra/
│
├── ingested/                    # Indexed documents (DB + metadata)
│   └── uploaded/                # User-uploaded files
│
├── package.json                 # Dependencies & scripts
├── .env                         # Environment variables (not in git)
├── .gitignore                   # Excludes node_modules, .env, uploads
└── HANDOFF.md                   # This file
```

---

## Key Features

### 1. **Real-Time Coaching**
- Listens via microphone or Deepgram
- Auto-detects when student finishes speaking (silence threshold: configurable 0.5–3s)
- Streams Claude responses in real-time (chunk by chunk)

### 2. **Knowledge Base**
- Index teacher's course documents (MD, PDF, images, code)
- Claude Vision extracts text from slides/diagrams
- RAG retrieves relevant context for each question
- Automatic topic detection

### 3. **Web Search Integration**
- Auto-detects npm, MDN, GitHub, Stack Overflow URLs
- Fetches real-time content for latest information
- Caches URLs to avoid re-fetching

### 4. **Study Tools** (Modal-based)
- **Quiz**: Auto-generates quizzes from indexed docs
- **Flashcards**: Flip-card study with navigation
- **Summary**: Topic-based lesson summaries

### 5. **Session Management**
- Stores all Q&A in SQLite (session-based)
- Session stats: answeredCount, filteredCount, avg response time
- Export to Markdown or Notion
- Tag filtering

### 6. **Audio Input Methods**
- **Built-in Mic**: Room audio (default)
- **BlackHole**: Direct Zoom audio capture (Mac only, requires installation guide)
- **Deepgram**: Professional speech-to-text (optional)
- **Web Speech API**: Fallback (built-in browser)

---

## API Endpoints

### Session Management
- `POST /api/session` - Create new session → `{ sessionId }`
- `GET /api/session/:id` - Get session details
- `PATCH /api/session/:id/title` - Update session title
- `PATCH /api/session/:id/tags` - Add tags
- `DELETE /api/session/:id` - Delete session
- `GET /api/sessions` - List all sessions

### Messages & Transcripts
- `GET /api/messages/:sessionId` - Get all Q&A pairs
- `POST /api/message` - Add new question
- `GET /api/transcripts/:sessionId` - Get full transcript

### Knowledge Base
- `GET /api/docs` - Get doc count & topics
- `POST /api/ingest` - Upload & index files
- `GET /api/rag?q=...&session=...` - Get relevant context

### Study Tools
- `POST /api/quiz` - Generate quiz
- `POST /api/flashcards` - Generate flashcards
- `POST /api/summary` - Generate summary

### Export
- `POST /api/export/markdown` - Export as Markdown
- `POST /api/export/notion` - Export to Notion

### WebSocket (`/transcribe`)
- Real-time speech-to-text streaming
- Events: `interim`, `final`, `utterance_end`, `speech_started`

---

## System Prompt (Core Instruction)

**Current (Updated March 2026)**:

```
You are a real-time coaching assistant listening to a live software engineering class.

Your ONLY job is to generate a smart, natural response that the STUDENT can say out loud
to their teacher or class — right now, in the moment.

RESPONSE TYPES:
- Teacher asks a question → direct, confident answer
- Teacher explains → thoughtful follow-up or reinforcing comment
- Teacher shows code → observation, edge case, or "what if" question
- Teacher mentions a tool/term → brief, sharp contribution showing understanding
- Student wants to ask something → precise, well-phrased question

VOICE & TONE:
- First person: "So basically...", "Right, because...", "That makes sense because..."
- Natural spoken cadence (short sentences, conversational)
- Confident but not arrogant
- Mirror teacher's exact vocabulary
- 1–3 sentences MAX (anything longer can't be said naturally)
- Never start with "As a student" or "I would say"
- Never use bullet points

KNOWLEDGE PRIORITY:
1. Course material (most authoritative)
2. Web search results (real-time info)
3. Your own engineering knowledge (fill gaps)
```

This was recently updated from an academic "tutor" prompt to a "student voice" prompt. Results are much more natural for classroom delivery.

---

## Development Workflow

### Local Development
```bash
# Terminal 1: Start dev server (auto-restart on file changes)
npm run dev

# Terminal 2: Run tasks as needed
npm run stats           # Show indexed doc stats
npm run list            # List all indexed docs
npm run ingest:slides   # Index slide folder
npm run convert:all     # Convert PNG slides to markdown
```

### Adding New Endpoints
1. Add handler in `server.js` (app.get/post/patch/delete)
2. Call appropriate utility functions (db.js, rag.js, etc.)
3. Return JSON response
4. Test with curl or browser

### Indexing New Documents
1. Place files in `teacher-docs/` or upload via UI
2. Run: `npm run ingest:slides` or use Upload modal
3. Check indexed docs: `npm run stats`
4. Verify topics detected: `npm run list`

### Modifying System Prompt
1. Open `server.js`, find "Build system prompt" comment (~line 515)
2. Update the template string in the array
3. Test by asking a question that should use new prompt
4. Check WebSocket messages for changes

---

## Important Implementation Details

### Scrolling & UI (Recent Fixes - March 2026)
The page had scrolling issues that were fixed:
- **Left sidebar**: Changed to `overflow-y: auto` (was `overflow: hidden`)
- **Right feed**: Added `min-height: 0` for flexbox
- **Modals**: All modals now properly scroll when content > viewport
- **Modal body**: Added `min-height: 0` for proper flex behavior

All panels now fully scroll and display all features.

### Deepgram Integration
- Optional but recommended for better accuracy
- WebSocket endpoint `/transcribe` handles speech streaming
- Falls back to Web Speech API if not configured
- Detects BlackHole audio device automatically (Mac only)

### RAG System
- Embedding-free: Uses text similarity + keyword matching
- Fast & deterministic (no vector DB needed)
- Handles markdown, code, and image-extracted text
- Deduplicates identical questions

### Claude Vision for Images
- Automatically processes PNG/JPG uploads
- Claude vision extracts text, code, diagrams
- Creates markdown from visual slides
- No extra cost for indexing (uses vision in ingest endpoint)

---

## Recent Changes (March 2026)

### System Prompt Redesign
**Old Prompt**: "You are a razor-sharp coding tutor answering questions with precision and depth."
**New Prompt**: "Generate responses a STUDENT can SAY OUT LOUD in class."

**Impact**: 
- Responses now 1–3 sentences (not lengthy explanations)
- First-person phrasing ("So basically...", "Right, because...")
- Natural spoken cadence
- Mirrors teacher's vocabulary exactly
- Students sound knowledgeable when delivering aloud

### UI Scrolling Fixes
- `.left` panel: `overflow-y: auto` instead of `overflow: hidden`
- `.modal`: `overflow-y: auto` instead of `overflow: hidden`
- Added `min-height: 0` to flex children for proper scrolling
- All pages now fully functional: Upload, Study, Shortcuts modals

### Import Fix
- Fixed duplicate `join` and `extname` imports in server.js
- Consolidated path imports at top of file

---

## Known Issues & Next Steps

### Current Limitations
1. **Deepgram Optional**: Without API key, falls back to Web Speech API (lower accuracy)
2. **No Vector DB**: RAG uses simple text matching (not semantic embeddings)
3. **Notion Export**: Not fully tested; requires manual verification
4. **Rate Limiting**: Global limits may affect heavy usage (see server.js ~line 50)
5. **Modal Size**: Study modal may need scrolling on small screens

### Next Steps for Developer
- [ ] Add WebSocket error handling & reconnection logic
- [ ] Implement exponential backoff for API calls
- [ ] Add topic-based question filtering (reduce irrelevant docs)
- [ ] Create admin endpoint to manage indexed docs
- [ ] Add streaming response cancellation (if user dismisses mid-stream)
- [ ] Implement session persistence (cookie/localStorage)
- [ ] Add analytics: question types, response times, accuracy
- [ ] Support multiple transcription providers (currently just Deepgram)
- [ ] Optimize RAG: add keyword extraction, category tagging
- [ ] Add test suite (unit + integration tests)

---

## Deployment Checklist

### Before Going Live
1. **Environment Variables** - Set all required keys in `.env`
   ```env
   ANTHROPIC_API_KEY=...
   DEEPGRAM_API_KEY=... (optional)
   PORT=3001
   SESSION_MAX_MESSAGES=60
   ```

2. **Database** - SQLite auto-creates on first run
   ```bash
   npm start
   # Creates ./devlisten.db automatically
   ```

3. **Knowledge Base** - Index course materials
   ```bash
   npm run ingest:slides
   npm run stats  # Verify
   ```

4. **Rate Limiting** - Check limits suit your deployment
   - Chat: 30 requests/min
   - Ingest: 20 uploads/min
   - Quiz: 15 requests/min
   - Bypass for localhost (127.0.0.1, ::1)

5. **Test** - Verify all features
   - Mic capture works
   - Questions generate responses
   - Upload files successfully
   - Study tools load
   - Export functions work

### Production Notes
- Use `npm start` (not `npm run dev`)
- Monitor CPU: Claude API is async but queuing many requests will increase load
- Monitor DB size: Sessions accumulate; implement cleanup if needed
- WebSocket connections: Each client holds one open
- Set `SESSION_MAX_MESSAGES` based on memory constraints

---

## Useful Commands

```bash
# Development
npm run dev          # Start server with auto-restart (nodemon)
npm start            # Start server (production)

# Document Management
npm run stats        # Show indexed docs, topic count, total embeddings
npm run list         # List all indexed docs with titles & metadata
npm run ingest:slides  # Index slide folder
npm run convert:all  # Convert PNG slides in /slides to markdown

# Quick Testing
open http://localhost:3001  # Open app in browser
curl http://localhost:3001  # Check if server is running

# Cleanup
rm devlisten.db      # Delete session database (nuclear option)
rm -rf ingested/     # Delete indexed docs cache
```

---

## Troubleshooting

### Server won't start
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill existing process
pkill -f "node server.js"

# Then start fresh
npm run dev
```

### Deepgram not connecting
```bash
# Check env var is set
echo $DEEPGRAM_API_KEY

# Server falls back to Web Speech API automatically
# Check browser console for WebSocket errors
```

### Claude API errors
```bash
# Verify API key in .env
# Check rate limits (Anthropic dashboard)
# Check request format in server.js ~line 560
```

### Documents not indexing
```bash
npm run stats
# Output shows: "0 docs indexed"

# Check /teacher-docs directory exists and has files
ls -la teacher-docs/

# Run ingest with verbose output
node bulk-ingest.js --stats
```

### Scrolling issues on page
- All scrolling issues were fixed March 2026
- Check `.left`, `.right`, `.modal` have `overflow-y: auto`
- Verify child flex items have `min-height: 0`

---

## Support & Questions

- **GraphQL/Database Schema**: See db.js for SQL queries
- **Response Generation**: See server.js line 515+ for system prompt
- **RAG Logic**: See rag.js for document retrieval
- **UI Components**: See public/index.html for modal & panel code
- **API Routing**: See server.js line 400+ for endpoint list

---

## Handoff Checklist

- [x] Code reviewed and documented
- [x] All scrolling & UI issues fixed
- [x] System prompt updated for "student voice"
- [x] Dependencies verified and installed
- [x] Environment variables configured
- [x] Database initialized
- [x] Server running at http://localhost:3001
- [x] README.md created
- [x] HANDOFF.md created (this document)

**Ready for next developer!** 🚀

---

**Last Updated**: March 24, 2026  
**Version**: 3.1.0  
**Status**: Fully functional, ready for production
