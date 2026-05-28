# Context: an alternative to passing props

Wouldn't it be great if we could "teleport" the data to components that need it *without* passing props?

**Context** lets a parent component provide data to the *entire* tree below it.

## Diagram: Component Tree with Context

```
┌─────────────────────────┐
│   Parent Component      │
│   (with Context)        │
└───────────┬─────────────┘
            │
    ┌───────┼───────┬──────────────┐
    │       │       │              │
┌───┴──┐ ┌──┴──┐ ┌──┴──┐      ┌────┴───┐
│Child │ │Child│ │Child│      │Grandch.│
└──────┘ └─────┘ └─────┘      └─┬──┬───┘
                                 │  │
                            ┌────┘  └────┐
                            │            │
                        ┌───┴──┐    ┌───┴──┐
                        │Great-│    │Great-│
                        │child │    │child │
                        └──────┘    └──────┘
```

---

**Page:** 6

**Footer:** All content is proprietary and confidential.