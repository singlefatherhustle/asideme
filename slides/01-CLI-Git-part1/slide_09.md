# Commit History

After making a few commits, the **commit history** of your repository might look like this. The **HEAD** is a label that tells which version of the repository we are currently looking at. By default, it is attached to the latest commit.

## Commands

```bash
git switch <hash>
```

will move the HEAD to a specific commit. For example, `git switch a2` will move the HEAD to the a2 commit.

## Diagram

```
HEAD (points to a4)
  ↓
a1 → a2 → a3 → a4
```

The diagram shows a linear commit history with four commits (a1, a2, a3, a4) connected by arrows indicating the progression of commits. The HEAD label is positioned above a2 in the visual representation.

---

*All content is proprietary and confidential.*