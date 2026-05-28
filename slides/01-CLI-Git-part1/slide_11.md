# Branches

## Main Branch

The **main** branch holds the "final draft" of the code and should be kept as professional as possible.

## Feature Branch

Most development work should be done in a **feature** branch, where it does not affect the code in production.

## Creating a Branch

```bash
git checkout -b <branch_name>
```

will create a new branch at the same commit as the HEAD.

## Diagram: Branch Structure

```
main branch (production):
a1 → a2 → a3 → a4

feature branch (development):
     ↓
     b3 → b4

Legend:
- feature (shown in blue box)
- HEAD (shown in orange/yellow box)
```

The diagram shows:
- A linear main branch with commits a1, a2, a3, a4
- A feature branch that diverges from a2, creating commits b3 and b4
- The main branch is indicated in the top right
- The feature branch and HEAD are indicated in the bottom right

---

*All content is proprietary and confidential.*