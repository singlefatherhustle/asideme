# Example

A **tree** is a collection of nodes that follow these rules:

- Each node can point to other nodes (**children**).
- Each node can only have one **parent**.
- A node cannot be its own ancestor.

## Is this a tree?

### Diagram

```
        A ←─────────────┐
        ↓ ↓ ↓           │
        B C D           │
                        │
        (arrow pointing back to A)
```

**Structure:**
- Node A has three children: B, C, and D
- There is a back-reference arrow from the right side pointing back to node A

---

*All content is proprietary and confidential.*

**Page: 8**