# Left join

There are three types of **outer joins**.

A left (outer) join returns **all** records from the left table, and matched records from the right table.

## SQL Syntax

```sql
SELECT *
FROM
    left_table
LEFT JOIN right_table ON …
```

## Visual Example

### Table 1

| A |
|---|
| A |
| B |
| C |
| D |

### Table 2

| A1 |
|----|
| A1 |
| A2 |
| C3 |
| D1 |
| E1 |

### LEFT (OUTER) JOIN Result

| A | A1   |
|---|------|
| A | A1   |
| A | A2   |
| B | NULL |
| C | C3   |
| D | D1   |

---

*All content is proprietary and confidential.*

Page 22