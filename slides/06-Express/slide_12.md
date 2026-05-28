# Build an API

First, we're going to focus on the API side of building a backend. To do that, we'll be using a library named **Express**.

## Architecture Diagram

```
┌─────────────────────────────┐         ┌──────────────────────────────────┐
│   client/frontend           │         │    server/backend                │
│                             │         │                                  │
│  ┌─────────────────────┐    │         │  ┌──────────┐      ┌──────────┐ │
│  │                     │    │         │  │          │      │          │ │
│  │   Web app           │◄──────────────►│   API    │◄────►│ Database │ │
│  │                     │    │         │  │          │      │          │ │
│  └─────────────────────┘    │         │  └──────────┘      └──────────┘ │
│                             │         │                                  │
└─────────────────────────────┘         └──────────────────────────────────┘
```

**Components:**
- **Web app** (client/frontend): User interface displayed in browser
- **API** (server/backend): Cloud service handling requests and business logic
- **Database** (server/backend): Data storage and retrieval

**Communication flow:** Web app ↔ API ↔ Database

---

*All content is proprietary and confidential.*

Page 9