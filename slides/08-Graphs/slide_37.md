# Adjacency list

An **adjacency list** is an associative array where value of the key i is a list containing all edges (and weights) connected to vertex i.

## Adjacency List Structure

| key | value |
|-----|-------|
| 0 | 1, 53 → 3, 86 |
| 1 | 2, 12 |
| 2 | |
| 3 | 1, 24 |

## Graph Representation

The adjacency list corresponds to the following directed weighted graph:

- **Vertex 0** connects to:
  - Vertex 1 (weight: 53)
  - Vertex 3 (weight: 86)

- **Vertex 1** connects to:
  - Vertex 2 (weight: 12)

- **Vertex 2** has no outgoing edges

- **Vertex 3** connects to:
  - Vertex 1 (weight: 24)

**Visual Graph Structure:**
```
    0 --53--> 1
    |         ↑
    |86       |24
    |         |
    ↓ --12--> 3
    2
```

---

*All content is proprietary and confidential.*

**Page: 25**