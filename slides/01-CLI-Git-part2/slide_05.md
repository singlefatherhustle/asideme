# Folder

A **folder** (or **directory**) is a file that contains the memory addresses of other files.
We say that a folder *contains* files.

## Memory Diagram

```
memory
┌─────────────────────────────────────────────────────┐
│ folder          │ file          │ file              │
├─────────────────┼───────────────┼───────────────────┤
│ 101      │ 102  │               │                   │
├──────┬───┴──────┤               │                   │
└──────┴──────────┴───────────────┴───────────────────┘
```

The diagram shows:
- A **folder** occupying memory addresses, with pointers to addresses 101 and 102
- Two **file** entries occupying separate memory regions
- Address references (101, 102) pointing from the folder to the files it contains

---

*All content is proprietary and confidential.*