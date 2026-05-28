# Sharing code between two files

As a package grows, it's best practice to split code into separate files, rather than writing everything in one big file.

A file can **export** functions and variables, which allows another file to **import** them!

## Diagram: Export/Import Pattern

```
fileA.js --export--> foo <--import-- fileB.js
                     (robot icon)
```

**Structure:**
- **fileA.js** (left file document icon) exports to a central module named "foo" (represented by a robot icon)
- **foo** (center) acts as the shared code module
- **fileB.js** (right file document icon) imports from foo
- Arrows show the direction: export from fileA → foo → import to fileB

---

*All content is proprietary and confidential.*

Page: 11