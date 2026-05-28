# Tree anatomy

## Definitions

- The **root** is the top-most parent.
- A **branch** is a sequence of ancestors and descendants.
- A **leaf** is a node with no children.
- The **height** of a tree is the length of the path from the root to the furthest leaf.
- A **level** is a set of nodes that are the same distance away from the root.

## Tree Structure Diagram

The diagram shows a tree with the following structure:

- **Root**: Node A (at the top)
- **Level 1**: Nodes B and C (children of A)
- **Level 2**: Nodes D, E, F (children of B) and G (child of C)

### Node Details

| Node | Type | Parent | Children |
|------|------|--------|----------|
| A | root | — | B, C |
| B | branch | A | D, E, F |
| C | branch | A | G |
| D | leaf | B | — |
| E | leaf | B | — |
| F | branch | B | — |
| G | leaf | C | — |

### Visual Elements

- Nodes are represented as circles
- Arrows indicate parent-child relationships
- Blue highlighted nodes (A, B, F) represent branches
- Green highlighted node (G) represents a leaf
- Height is measured vertically from root to furthest leaf
- Level grouping is shown with a horizontal bracket on the left

---

*All content is proprietary and confidential.* — Page 6