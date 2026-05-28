# Merge

What do you do when you're done with a feature? You switch back to the main branch and **merge** in the changes from the feature branch! After a merge, both branches and the HEAD will all refer to the same **merge commit**.

## Diagram

```
a1 → a2 → a3 → a4 → a5
     ↓              ↑
     └→ b3 → b4 ────┘
```

### Branch References
| Reference | Points to |
|-----------|-----------|
| HEAD | a5 |
| main | a5 |
| feature | a5 |