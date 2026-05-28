# Review

## How do you represent a 1-N relationship between two tables?

A non-unique foreign key creates a 1-N relationship between two tables.

## Database Schema Diagram

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
| book_id | integer | |

### Relationship

The `book_id` column in the `chapters` table creates a foreign key relationship to the `id` column (primary key) in the `books` table, establishing a 1-N (one-to-many) relationship.

---

All content is proprietary and confidential.