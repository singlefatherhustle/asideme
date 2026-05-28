# courses?

If we put the foreign key in `courses`, 1 student can now be enrolled in many courses, but each course can only have 1 student. That's still a problem!

## Database Schema Diagram

### courses table
| Column | Type | Constraint |
|--------|------|-----------|
| id | serial | PK |
| name | text | NN |
| student_id | int | FK → students |

### students table
| Column | Type | Constraint |
|--------|------|-----------|
| id | serial | PK |
| name | text | NN |

**Relationship:** courses.student_id references students.id (one-to-many, but inverted — each course can only reference one student)