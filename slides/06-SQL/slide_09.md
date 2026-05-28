# Databases

Today, we're going to focus on the **database** side of building a backend.

## Architecture Diagram

```
┌─────────────────────────────────┐         ┌──────────────────────────────────┐
│     client/frontend             │         │      server/backend              │
│                                 │         │                                  │
│  ┌─────────────────────────┐   │         │  ┌──────────┐    ┌──────────┐   │
│  │                         │   │         │  │          │    │          │   │
│  │      Web app            │   │◄───────►│  │   API    │◄──►│ Database │   │
│  │                         │   │         │  │          │    │          │   │
│  └─────────────────────────┘   │         │  └──────────┘    └──────────┘   │
│                                 │         │                                  │
└─────────────────────────────────┘         └──────────────────────────────────┘
```

**Components:**
- **Web app** — Client-side interface
- **API** — Application Programming Interface (server-side middleware)
- **Database** — Data storage and retrieval system

---

*All content is proprietary and confidential.*

Page 6