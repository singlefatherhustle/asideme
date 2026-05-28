# Add another table

We can add a **junction table** *between* them, whose primary purpose is to hold the foreign keys. A many-to-many relationship is actually just a 1-many relationship from both sides!

- 1 **course** has many **students**
- 1 **student** has many **courses**

## Database Schema Diagram

| courses |  |  |
|---------|--|--|
| id | serial | PK |
| name | text | NN |

| courses_students |  |  |
|------------------|--|--|
| course_id | int | NN |
| student_id | int | NN |

| students |  |  |
|----------|--|--|
| id | serial | PK |
| name | text | NN |

**Relationships:**
- `courses.id` (PK) ← `courses_students.course_id` (FK)
- `students.id` (PK) ← `courses_students.student_id` (FK)