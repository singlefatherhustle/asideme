# psql

We use the command line to interact with **psql**, which is a **database client**.

A database *client* sends *requests* to a database *server*.
The database server sends *responses* to the database client.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  psql              PostgreSQL         database     │
│  database client   database server                 │
│  >_                 🐘                 🗄️          │
│   ↔────────────────  ↔───binary───────↔          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Components:**
- **psql** (database client) — command line interface marked with `>_` prompt
- **PostgreSQL** (database server) — represented by elephant logo
- **database** — represented by cylinder storage icon
- **Connections:** bidirectional arrows between client and server; binary protocol connection between server and database

---

*All content is proprietary and confidential.*

**Page: 9**