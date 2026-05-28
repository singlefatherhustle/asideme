# How do you delete a referenced record?

How do we delete book #3 then? There are two main options:

1. Delete all of the related chapters, and then we can delete book #3.
2. Make the deletion of the book **cascade** to all related records.
   a. In other words, do option #1 automatically.

This can be specified when adding the foreign key constraint.

```sql
book_id int REFERENCES books(id) ON DELETE CASCADE
```

---

*All content is proprietary and confidential.*

Page 10