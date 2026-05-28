# Full join

A full (outer) join returns all records from **both** tables, even if there is no match.

## SQL Syntax

```sql
SELECT *
FROM
    left_table
FULL JOIN right_table ON …
```

## Visual Example

### Table 1

| Column |
|--------|
| A      |
| B      |
| C      |
| D      |

### Table 2

| Column |
|--------|
| A1     |
| A2     |
| C3     |
| D1     |
| E1     |

### FULL (OUTER) JOIN Result

| Table 1 | Table 2 |
|---------|---------|
| A       | A1      |
| A       | A2      |
| B       | NULL    |
| C       | C3      |
| D       | D1      |
| NULL    | E1      |

---

*All content is proprietary and confidential.*

Page 24