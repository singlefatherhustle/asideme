# Create a table

When we create a table, we specify its **schema** (name and type of each column).
We can also specify **constraints** for each column.
A **constraint** is a rule that specifies what data is allowed in the table.

## Generic Syntax

```sql
CREATE TABLE table_name (
    column_name column_type constraints
);
```

## Example: menu table

```sql
CREATE TABLE menu (
    id              serial      PRIMARY KEY,
    category        text        NOT NULL,
    name            text        NOT NULL UNIQUE,
    price           decimal     NOT NULL
);
```

---

*All content is proprietary and confidential.*

**Page: 7**