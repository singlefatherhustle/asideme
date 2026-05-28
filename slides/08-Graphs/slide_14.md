# Example

A **tree** is a collection of nodes that follow these rules:

- Each node can point to other nodes (**children**).
- Each node can only have one **parent**.
- A node cannot be its own ancestor.

## Is this a tree?

**No, because D has two parents A and E.**

## Diagram

```
    A           E
   /|\           |
  / | \          |
 B  C  D --------+
```

**Structure:**
- Node A points to nodes B, C, and D
- Node E points to node D
- Node D has two parent nodes: A and E (violating the tree rule)

---

*All content is proprietary and confidential.*

**Page: 9**