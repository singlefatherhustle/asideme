# Example

A **tree** is a collection of nodes that follow these rules:

- Each node can point to other nodes (**children**).
- Each node can only have one **parent**.
- A node cannot be its own ancestor.

## Is this a tree?

### Diagram Structure

```
    A (root node)
    ↓
    B
    ↓
    C
    ↓
    D
```

**Nodes:** A, B, C, D

**Relationships:**
- A points to B (B is a child of A, A is parent of B)
- B points to C (C is a child of B, B is parent of C)
- C points to D (D is a child of C, C is parent of D)

---

*All content is proprietary and confidential.*

Page 11