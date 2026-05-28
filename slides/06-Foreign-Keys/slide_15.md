# Other constraints

## Question
What would adding a NOT NULL constraint to a foreign key imply about the relationship?

## Key Points
- No constraint = *optional* relationship
- NOT NULL constraint = *mandatory* relationship

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
| book_id | integer | NN |

### Relationship
The `book_id` field in the `chapters` table has a foreign key relationship to the `id` field in the `books` table (indicated by the connecting line in the diagram).

---

*All content is proprietary and confidential.*