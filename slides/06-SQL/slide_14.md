# SQL is for relational databases

SQL is the language used to interact with **relational databases**.

A relational database represents data as **records** within related **tables**.
A **non-relational database** does *not* represent data as related tables.

## Diagram

```
                    ┌─────────────────┐
                    │   relational    │
                    │    database     │
                    └────────────────┬┘
                                    ▲
                                    │
                                    │
                            SQL ────┤
                                    │
                                    │ ✗ (blocked/not applicable)
                                    │
                    ┌───────────────┴┐
                    │   non-         │
                    │  relational    │
                    │    database    │
                    └────────────────┘
```

SQL has a direct connection (arrow pointing up) to relational databases, while a blocked/crossed line (✗) indicates SQL does not work with non-relational databases.

---

*All content is proprietary and confidential.*

Page 11