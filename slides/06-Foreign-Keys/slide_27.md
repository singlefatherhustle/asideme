# Right join

A **right (outer) join** returns *all* records from the *right* table, and matched records from the left table.

## SQL Syntax

```sql
SELECT *
FROM
    left_table
RIGHT JOIN right_table ON …
```

## Tables

| table 1 |
|---------|
| A       |
| B       |
| C       |
| D       |

| table 2 |
|---------|
| A1      |
| A2      |
| C3      |
| D1      |
| E1      |

## RIGHT (OUTER) JOIN Result

| A    | A1 |
|------|-----|
| A    | A1  |
| A    | A2  |
| C    | C3  |
| D    | D1  |
| NULL | E1  |

---

*All content is proprietary and confidential.*

Page 23