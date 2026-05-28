# Other constraints

## Question
What would adding a UNIQUE constraint to a foreign key imply about the relationship?

## Database Schema Diagram

### Tables

**books**
| Column | Type | Constraint |
|--------|------|-----------|
| id | serial | PK |
| title | text | NN |
| author | text | NN |

**chapters**
| Column | Type | Constraint |
|--------|------|-----------|
| id | serial | PK |
| title | text | NN |
| book_id | integer | U |

### Relationship
- Foreign key relationship from `chapters.book_id` to `books.id`
- The `book_id` column in chapters table has a UNIQUE constraint (U)

---

*All content is proprietary and confidential.*