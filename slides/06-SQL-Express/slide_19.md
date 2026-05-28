# The Database Server Sends Results

PostgreSQL will then interact with the database files. If everything goes smoothly, the results (such as the created record) are sent back to `pg`, who passes it along to the original query function.

## Data Flow Diagram

```
Database ↔ PostgreSQL → pg → painting → createPainting
```

### Components:
- **Database** - Database files
- **PostgreSQL** - Database server
- **pg** - Node.js PostgreSQL client library
- **painting** - Data object/model
- **createPainting** - Query function that initiated the request

---

*All content is proprietary and confidential.*

Page 16