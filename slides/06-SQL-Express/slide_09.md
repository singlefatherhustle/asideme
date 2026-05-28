# Update records in a table

You can update column values for **all** the records in a table, but you usually want to **filter** for specific records that you want to update.

## General Syntax

```sql
UPDATE table_name
SET
    column_name_1 = column_value_1,
    column_name_2 = column_value_2;
```

## Example

```sql
UPDATE menu
SET
    category = 'appetizer',
    price = 10.99
WHERE id = 1;
```

---

*All content is proprietary and confidential.*

**Page: 6**