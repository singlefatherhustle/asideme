# Pull

Cloning a repository is like making a photocopy! It is a snapshot in time and does **not** automatically update, even if there are new commits in the remote repository.

`git pull` will **fetch** the changes from the remote repository and **merge** them into our local repository.

## Diagram

```
GitHub (Remote)                          Local
    [Repository folder]  --git pull-->  [Repository folder]
         (in cloud)                      (on computer)
```

The diagram shows:
- **Left side (GitHub Remote)**: A cloud shape containing a yellow folder labeled "Repository"
- **Arrow**: Labeled "git pull" pointing from left to right
- **Right side (Local)**: A yellow folder labeled "Repository" next to a laptop/computer icon
- Both sides are labeled with their respective locations

---

*All content is proprietary and confidential.*