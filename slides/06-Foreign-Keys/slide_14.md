# Other constraints

## Question

What would adding a NOT NULL constraint to a foreign key imply about the relationship?

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
| book_id | integer | NN |

### Relationship

- Foreign key relationship shown between `books.id` (PK) and `chapters.book_id` (references books table)

---

*All content is proprietary and confidential.*