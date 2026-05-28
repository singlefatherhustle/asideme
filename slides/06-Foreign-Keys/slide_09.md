# Referential Integrity

We can add a **foreign key** constraint on `book_id` to enforce **referential integrity**. Any value in that column *must* reference an *existing* value in the *referenced* column.

Now, the `book_id` of a `chapter` *must* refer to the `id` of an existing `book`.

```sql
book_id int REFERENCES books(id)
```

## Database Schema Diagram

### books table

| id | serial | PK |
|---|---|---|
| title | text | NN |
| author | text | NN |

### chapters table

| id | serial | PK |
|---|---|---|
| title | text | NN |
| book_id | integer |  |

**Relationship**: The `book_id` column in the `chapters` table references the `id` column in the `books` table (shown by the connecting line in the diagram).

---

All content is proprietary and confidential.