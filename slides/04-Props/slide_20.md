# Lift state up

If you want two components to share the **same** piece of state, then that state must live in their **closest common ancestor**, and then passed back down to them via props.

This is known as **lifting state up**. ([docs](https://react.dev/learn/sharing-state-between-components))

## Diagram: Lift State Up Pattern

**Before (Left side):**
```
Accordion
├── Panel
│   └── isActive: true
└── Panel
    └── isActive: false
```

**After (Right side):**
```
Accordion
└── activeIndex: 1
    ├── Panel
    │   └── isActive: false
    └── Panel
        └── isActive: true
```

**Flow:** The arrow shows the refactoring process moving state from individual Panel components up to their closest common ancestor (Accordion), which then passes it back down via props.

---

*All content is proprietary and confidential.*

**Page: 16**