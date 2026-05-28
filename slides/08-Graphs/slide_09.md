# Example

A **tree** is a collection of nodes that follow these rules:

- Each node can point to other nodes (**children**).
- Each node can only have one **parent**.
- A node cannot be its own ancestor.

## Is this a tree?

### Diagram

```
        A
       /|\
      / | \
     B  C  D
```

**Structure:**
- Node A (root) points to three children: B, C, and D
- B, C, and D each have exactly one parent (A)
- No cycles exist (no node is its own ancestor)

---

*All content is proprietary and confidential.*