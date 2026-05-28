# Review

## What does node-postgres (pg) allow us to do?

pg is a database client that translates our JavaScript into SQL, allowing us to interact with the database from the JavaScript side.

## Architecture Diagram

```
Dev ←→ JS ←→ pg ←→ SQL ←→ PostgreSQL ←→ binary ←→ database
```

**Components:**
- **Dev** - Developer
- **pg** - Node-postgres client (green elephant logo)
- **PostgreSQL** - Database server (elephant logo)
- **database** - Data storage (cylinder icon)

**Protocols:**
- JS: Communication between Dev and pg
- SQL: Communication between pg and PostgreSQL
- binary: Communication between PostgreSQL and database

---

*All content is proprietary and confidential.*

Page 5