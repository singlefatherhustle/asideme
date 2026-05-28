# Example

A **tree** is a collection of nodes that follow these rules:

- Each node can point to other nodes (**children**).
- Each node can only have one **parent**.
- A node cannot be its own ancestor.

## Is this a tree?

### Diagram

```
        A                 E
       /|\                |
      / | \               |
     B  C  D              D
```

**Structure:**
- Node A has three children: B, C, and D
- Node E has one child: D
- Node D has two parents: A and E

**Relationships:**
- A → B (parent-child)
- A → C (parent-child)
- A → D (parent-child)
- E → D (parent-child)

---

*All content is proprietary and confidential.*

**Page: 9**