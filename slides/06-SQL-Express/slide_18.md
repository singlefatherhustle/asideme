# 6. Send a request from the database client

The query function constructs a request to be sent by **pg**, the database client that we are using to communicate with PostgreSQL, our database server.

In this example, **createPainting** will ask to insert a new record.

## Diagram: Data Flow from createPainting to PostgreSQL

```
createPainting → pg → INSERT INTO paintings → PostgreSQL
```

**Components:**
- **createPainting** (robot icon): The function initiating the request
- **pg** (elephant icon): The database client
- **PostgreSQL** (database icon): The database server receiving the INSERT command

---

*All content is proprietary and confidential.*

Page 15