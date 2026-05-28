# Vite also bundles code

A typical React project has dozens, if not hundreds, of components, each of which is written in its own file. That's a lot of files!

In addition to transpiling our code, Vite also **bundles** our code. That means it neatly compacts and organizes all of our files into a single JS file.

## Diagram: Code Bundling Process

```
┌─────────────────────────┐
│   Multiple JS Files     │
│  ┌──────┐ ┌──────┐      │
│  │ JS   │ │ JS   │ ...  │
│  └──────┘ └──────┘      │
│  ┌──────┐ ┌──────┐      │
│  │ JS   │ │ JS   │ ...  │
│  └──────┘ └──────┘      │
└─────────────────────────┘
           │
           │ bundle
           ↓
        ┌──────┐
        │ JS   │
        └──────┘
   (Single bundled file)
```

---

**Page:** 14