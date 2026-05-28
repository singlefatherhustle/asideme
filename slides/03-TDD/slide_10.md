# What is a package?

A **package** is simply a folder of code in the context of Node. Every package is identified by a file named **package.json**, which lives in the folder alongside the code.

## package.json Contents

**package.json** contains *metadata* about the package, such as:

- the name of the project
- the main file of the project
- the project's dependencies

## Package Structure Diagram

```
package (folder)
├── node_modules (folder)
├── package.json (file)
└── index.js (file)
```

The diagram shows a package folder at the top level with three items branching downward:
1. **node_modules** — a folder (shown in yellow)
2. **package.json** — a file (shown with document icon)
3. **index.js** — a file (shown with document icon)

---

*All content is proprietary and confidential.*

Page: 10