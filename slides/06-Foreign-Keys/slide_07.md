# Relationships between tables

A relational database is all about *relationships*! Let's start with an example.
A **book** has an **id**, **title**, and **author**.
Each book can be divided into **chapters**, and each chapter has an **id** and a **title**.

How do we capture the **relationship** between these two tables?

## Tables

### books

| id | serial | PK |
|---|---|---|
| title | text | NN |
| author | text | NN |

### chapters

| id | serial | PK |
|---|---|---|
| title | text | NN |

---

*All content is proprietary and confidential.*