# Issues with prop drilling

Imagine you had to drill props through 20 generations of components. What issues do you think might come up?

## Component Hierarchy Diagram

```
                          ┌─────────────┐
                          │   (root)    │
                          └──────┬──────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
               ┌────┴────┐             ┌─────┴────┐
               │          │             │          │
          ┌────┴───┐  ┌───┴────┐   ┌───┴────┐ ┌──┴─────┐
          │ (blue) │  │ (blue) │   │ (empty)│ │ (blue) │
          └────────┘  └────────┘   └────────┘ └───┬────┘
                                                   │
                                              ┌────┴─────┐
                                              │           │
                                         ┌────┴───┐  ┌───┴────┐
                                         │ (blue) │  │ (blue) │
                                         └────────┘  └────────┘
```

**Legend:**
- Blue-filled boxes = Components that use the prop
- Empty/outline boxes = Components that only pass the prop through (intermediate components)

---

*All content is proprietary and confidential.*

**Page 5**