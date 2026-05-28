# Other constraints

## What would adding a UNIQUE constraint to a foreign key imply about the relationship?

A UNIQUE constraint would mean that each chapter must belong to a *different* book. In other words, no two chapters can belong to the same book.

## Database Schema Diagram

```
┌─────────────────────────────┐         ┌─────────────────────────────┐
│          books              │         │        chapters             │
├─────────────────────────────┤         ├─────────────────────────────┤
│ id      │ serial  │ PK      │◄────────│ id      │ serial  │ PK      │
│ title   │ text    │ NN      │         │ title   │ text    │ NN      │
│ author  │ text    │ NN      │         │ book_id │ integer │ U       │
└─────────────────────────────┘         └─────────────────────────────┘
```

### Table: books

| Column | Type | Constraint |
|--------|------|------------|
| id | serial | PK |
| title | text | NN |
| author | text | NN |

### Table: chapters

| Column | Type | Constraint |
|--------|------|------------|
| id | serial | PK |
| title | text | NN |
| book_id | integer | U |

---

*All content is proprietary and confidential.*