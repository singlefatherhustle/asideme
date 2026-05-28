# Depth-first search

If you use a **stack** to keep track of nodes to visit, then you will perform what's known as a **depth-first search**. The algorithm will visit nodes as far as possible along each branch.

## Diagram: Depth-first Search Tree Traversal

```
                        A (1)
                       /     \
                      /       \
                    B (2)     C (5)
                   /   \       /
                  /     \     /
                D (3)  E (4) F (6)
```

**Node visit order:** 1 → 2 → 3 → 4 → 5 → 6

**Nodes labeled with visit sequence:**
- A: 1
- B: 2
- D: 3
- E: 4
- C: 5
- F: 6

The diagram shows a tree structure where nodes are visited depth-first: the algorithm goes deep into the left branch (A → B → D, then backtrack to B → E) before exploring the right branch (A → C → F).

---

*All content is proprietary and confidential.*

Page 30