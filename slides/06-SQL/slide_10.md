# A database is just a file

A **database** is a sequence of binary in memory that represents some data.

## What's so special about a database file?

The data is **structured** in a way that's optimized for **lots** of CRUD operations on **lots** of data.

## Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ memory                                                          │
│ 101010101011101110101010010101001111010101101010101010110       │
└─────────────────────────────────────────────────────────────────┘
        │                                               │
        ▼                                               ▼
┌──────────────┬─────────────────────┬──────────┬──────────────┐
│    file      │                     │database  │    file      │
└──────────────┴─────────────────────┴──────────┴──────────────┘
```

---

*All content is proprietary and confidential.*

**Page: 7**