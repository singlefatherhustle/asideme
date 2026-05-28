# Common constraints

The constraints that we'll most commonly be using (for now) are:

- **NOT NULL** = a record cannot have a NULL value in that column
- **UNIQUE** = all values in a column must be different
- **PRIMARY KEY** = unique identifier for each record
  - combination of NOT NULL and UNIQUE

Any CRUD operation that **violates** a constraint will automatically be cancelled.

This ensures that the data in a table is consistent and reliable!

---

*All content is proprietary and confidential.*