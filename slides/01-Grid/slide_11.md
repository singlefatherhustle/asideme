# Adjust ratios

By default, flex containers will try to distribute free space evenly amongst its children. We can override that behavior by telling a specific *flex-item* to **grow** or **shrink**.

## Diagram: Flex Container with flex-grow

```
┌─────────────────────────────────────────────────────┐
│ flex container                                      │
│                                                     │
│  ┌───┐  ┌──────────────────┐  ┌───┐                │
│  │ A │  │        B         │  │ C │  ──→ main axis │
│  └───┘  └──────────────────┘  └───┘                │
│         ↑                                            │
│         └─ flex-grow: 1                             │
└─────────────────────────────────────────────────────┘
```

**Labels:**
- Item A: (no flex property)
- Item B: highlighted in orange with `flex-grow: 1`
- Item C: (no flex property)
- Main axis: horizontal direction indicated by arrow

---

*All content is proprietary and confidential.*

Page: 11