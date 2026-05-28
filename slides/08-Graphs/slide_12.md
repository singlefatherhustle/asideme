# Example

A **tree** is a collection of nodes that follow these rules:

- Each node can point to other nodes (**children**).
- Each node can only have one **parent**.
- A node cannot be its own ancestor.

## Is this a tree?

**No, because A is its own ancestor.**
**A is the parent of D, who is the parent of A.**

## Diagram

```
        A ←──────┐
       ↙ ↓ ↘     │
      B  C  D ───┘
```

**Structure:**
- Node A points to nodes B, C, and D (children)
- Node D points back to node A
- This creates a cycle: A → D → A
- This violates the rule that a node cannot be its own ancestor

---

*All content is proprietary and confidential.*