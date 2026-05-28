# Review

## What is a database client?

A database client sends requests to a database server to query or mutate some data stored in a database.

## Diagram: Database Client Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌──────────────┐
│      psql       │◄───────►│   PostgreSQL     │◄─binary─►│   database   │
│                 │         │                  │         │              │
│ database client │         │ database server  │         │              │
└─────────────────┘         └──────────────────┘         └──────────────┘
```

**Components:**
- **psql** - database client
- **PostgreSQL** - database server
- **database** - data storage
- **binary** - communication protocol between server and database

---

*All content is proprietary and confidential.*

Page 4