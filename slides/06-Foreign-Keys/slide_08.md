# Add a new field

By adding a new `book_id` field to `chapters`, we now have a way for each chapter to know which book it belongs to.

For example, a `chapter` with `book_id` 3 would belong to `book` #3.
A potential issue arises. How do we know that book #3 actually exists?

## Database Schema

| books |  |  |
|-------|-------|-------|
| id | serial | PK |
| title | text | NN |
| author | text | NN |

| chapters |  |  |
|----------|-------|-------|
| id | serial | PK |
| title | text | NN |
| book_id | integer |  |

---

All content is proprietary and confidential.