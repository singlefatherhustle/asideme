# One-to-one

A *unique* foreign key creates a **one-to-one** (1-1) relationship between the two tables.

- 1 **book** has 1 **chapter**
- 1 **chapter** belongs to 1 **book**

In this case, a 1-1 relationship between **books** and **chapters** doesn't make that much sense. Can you think of examples where a 1-1 relationship *does* make sense?

## Database Schema

### books table

| Column | Type | Constraint |
|--------|------|-----------|
| id | serial | PK |
| title | text | NN |
| author | text | NN |

### chapters table

| Column | Type | Constraint |
|--------|------|-----------|
| id | serial | PK |
| title | text | NN |
| book_id | integer | U |

**Relationship:** books.id (PK) ←→ chapters.book_id (FK, Unique)

---

*All content is proprietary and confidential.*

Page 14