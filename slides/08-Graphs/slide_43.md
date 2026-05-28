# Breadth-first search

If you use a **queue** to keep track of nodes to visit, then you will perform what's known as a **breadth-first search**. The algorithm will visit all the nodes on a level before the next level.

## Diagram: Breadth-First Search Tree Traversal

```
                    1
                    A
                   / \
                  /   \
                 2     3
                 B     C
                / \    |
               /   \   |
              4     5  6
              D     E  F
```

**Node visit order with queue-based traversal:**
- Level 0: Node A (labeled 1)
- Level 1: Nodes B, C (labeled 2, 3)
- Level 2: Nodes D, E, F (labeled 4, 5, 6)

---

*All content is proprietary and confidential.*

**Page: 31**