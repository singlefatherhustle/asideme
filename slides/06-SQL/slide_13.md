# SQL

## What language does psql use to communicate with PostgreSQL?

**Structured Query Language (SQL)!**

It is a *language* that allows us to *query* data from a database that is *structured* in a way that's optimized for lots of CRUD operations on lots of data.

## Diagram: SQL Communication Flow

```
psql ←—SQL—→ PostgreSQL ←—binary—→ database
  >_           🐘              🗄️
```

**Components:**
- **psql**: Command-line interface (terminal icon with `>_`)
- **SQL**: Query language (arrow label between psql and PostgreSQL)
- **PostgreSQL**: Database management system (elephant logo)
- **binary**: Binary protocol (arrow label between PostgreSQL and database)
- **database**: Data storage (cylinder icon)

---

*All content is proprietary and confidential.*

**Page: 10**