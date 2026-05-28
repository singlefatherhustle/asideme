# Insert a record

Once a table is created, you can **insert** a new record into the table.

## Generic Syntax

```sql
INSERT INTO table_name
    (...column_names)
VALUES
    (...column_values);
```

## Example

```sql
INSERT INTO menu
    (category, name, price)
VALUES
    ('appetizer', 'gyoza', 4.75);
```

---

All content is proprietary and confidential.