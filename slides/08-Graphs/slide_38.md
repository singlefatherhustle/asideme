# Adjacency list

The space complexity of an adjacency list is O(V+E), where V is the number of vertices and E is the number of edges.

## What are the time complexities of:

- checking if an edge exists?
- getting the weight of an edge?
- adding an edge?
- removing an edge?
- adding a vertex?
- removing a vertex?
- getting all neighbors of a vertex?

## Adjacency List Diagram

```
key | value
----|-------
 0  | 1 → 53 → 3 → 86
 1  | 2 → 12
 2  | (empty)
 3  | 1 → 24
```

The diagram shows a hash map structure where:
- Key 0 points to a linked list containing: 1, 53, 3, 86
- Key 1 points to a linked list containing: 2, 12
- Key 2 has no adjacent vertices
- Key 3 points to a linked list containing: 1, 24

---

*All content is proprietary and confidential.*

Page 26