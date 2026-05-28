# Branches

This is actually one of the main benefits of using Git! It allows us to very easily maintain different versions of a project. It can be difficult to remember the hashes of all the commits. Instead, we use **branches**, which are human-readable bookmarks for specific commits.

HEAD is actually just a special branch!

## Diagram: Git Commit History with Branches

```
a1 → a2 → a3 → a4
     ↓
     b3 → b4
```

**Labels:**
- `main` — points to commit a4
- `feature` — points to commit b3
- `HEAD` — points to the feature branch (currently active)

---

*All content is proprietary and confidential.*