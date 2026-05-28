# Stuck at an impasse

- We can't put the foreign key in `courses`.
- We can't put the foreign key in `students`.

So what should we do?

## Database Schema Diagram

### courses table
| Column | Type | Constraint |
|--------|------|------------|
| id | serial | PK |
| name | text | NN |

### students table
| Column | Type | Constraint |
|--------|------|------------|
| id | serial | PK |
| name | text | NN |

### Relationship
A `foreign key` connection point shown between the `courses` and `students` tables (depicted with connecting lines and asterisks indicating the relationship is unresolved)