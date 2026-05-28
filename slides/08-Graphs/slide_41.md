# Graph traversal

Regardless of which data structure you use to implement your graph, the algorithm to iterate through, or **traverse**, the graph is the same.

Given a graph `G` and a starting vertex `v`,
- `toVisit` = list of vertices to visit
- add `v` to `toVisit`
- while `toVisit` is not empty
  - `current` = next vertex from `toVisit`
  - if we have not visited `current` yet
    - visit `current`
    - add all of `current`'s neighbors to `toVisit`

---

All content is proprietary and confidential.

29