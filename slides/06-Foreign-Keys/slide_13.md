# One-to-many

By adding a foreign key to **chapters** that references **books**, we have established a **one-to-many (1-N) relationship** between the two tables.

- 1 **book** *has many* **chapters**
- Many **chapters** *belong to* 1 **book**

## Database Schema Diagram

### books table

| Column | Type | Constraint |
|--------|------|------------|
| id | serial | PK |
| title | text | NN |
| author | text | NN |

### chapters table

| Column | Type | Constraint |
|--------|------|------------|
| id | serial | PK |
| title | text | NN |
| book_id | integer | FK |

**Relationship**: The `book_id` field in the **chapters** table serves as a foreign key referencing the `id` field in the **books** table.

---

*All content is proprietary and confidential.*