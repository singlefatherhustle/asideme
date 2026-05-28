# How do you use JavaScript?

Instead of psql, we'll use a new JavaScript library named **node-postgres (pg)**.

**pg** is a database *client* that translates our JavaScript into SQL.

## Architecture Diagram

### Traditional Approach (psql)
```
psql --[SQL]--> PostgreSQL --[binary]--> database
```

### Using node-postgres (pg)
```
Dev --[JS]--> pg --[SQL]--> PostgreSQL --[binary]--> database
```

The diagram shows:
- **Dev**: Developer/Application
- **pg**: Node-postgres library (green elephant icon)
- **PostgreSQL**: Database server (blue elephant icon)
- **database**: Data storage (cylinder icon)

Data flow arrows labeled with communication protocols:
- JS: JavaScript communication from Dev to pg
- SQL: SQL queries from pg to PostgreSQL
- binary: Binary protocol from PostgreSQL to database

---

*All content is proprietary and confidential.*

Page 12