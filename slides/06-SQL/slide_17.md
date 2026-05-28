# Recap

## Key Concepts

- **psql** is the database client we use to communicate with PostgreSQL.
- **PostgreSQL** is a DBMS, or database server, that manages relational databases.
- A relational database structures its data as **tables**.
- We write **SQL** to query and mutate data stored in relational databases.

## Architecture Diagram

```
psql ←→ PostgreSQL ←→ database
  ↓         ↓           ↓
  └─ SQL ─→ └─ binary ─→ └
```

**Components:**
- **psql**: Database client (terminal interface)
- **PostgreSQL**: DBMS/database server (elephant logo shown)
- **database**: Data storage (cylinder icon)

**Communication:**
- psql communicates with PostgreSQL via SQL
- PostgreSQL communicates with the database via binary protocol

---

*All content is proprietary and confidential.*

**Page: 14**