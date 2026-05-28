# JOIN the tables together

## What would the output be of the following SQL?

```sql
SELECT
    courses.name AS course_name,
    students.name AS student_name
FROM
    courses_students
    JOIN courses ON courses_students.course_id = courses.id
    JOIN students ON courses_students.student_id = students.id
```

---

All content is proprietary and confidential.

14