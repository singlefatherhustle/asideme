# JOIN

The **JOIN** clause is used to combine the *rows* from two or more tables, based **ON** a *related column* between them.

```sql
SELECT
    books.title,
    books.author,
    chapters.title
FROM
    books
    JOIN chapters ON chapters.book_id = books.id;
```

---

All content is proprietary and confidential.

20