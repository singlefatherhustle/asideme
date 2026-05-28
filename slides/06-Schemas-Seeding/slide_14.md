# How do you seed a database?

One common method is to write the seed data in a `.sql` file and execute it with psql. This is useful if:

- there's already an existing dataset
- you know exactly what data you'll be working with ahead of time

## Diagram: SQL Seeding Process

```
seed.sql → psql → database
                    (with sprout)
```

**Components:**
- **seed.sql** - File containing seed data
- **psql** - PostgreSQL command-line interface
- **database** - Target database (represented with a sprouting plant icon)

## Alternative Method

Another method, which we'll be doing in bootcamp, is to generate the data with JavaScript.

---

*All content is proprietary and confidential.*

**Page: 11**