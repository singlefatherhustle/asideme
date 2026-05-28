# students?

Putting the foreign key in **students** would mean that 1 course has many students, but each student could only be enrolled in 1 course.

## Entity Relationship Diagram

```
┌─────────────────────┐         ┌──────────────────────┐
│      courses        │         │      students        │
├─────────────────────┤         ├──────────────────────┤
│ id      serial  PK  │────────→│ id      serial  PK   │
│ name    text    NN  │         │ name    text    NN   │
└─────────────────────┘         │ course_id  int       │
                                └──────────────────────┘
```

| Table | Column | Type | Constraints |
|-------|--------|------|-------------|
| courses | id | serial | PK |
| courses | name | text | NN |
| students | id | serial | PK |
| students | name | text | NN |
| students | course_id | int | FK |

---

*All content is proprietary and confidential.*

Page 8