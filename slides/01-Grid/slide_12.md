# Wrap

If there isn't enough free space on the main axis, we can tell the flex container to **wrap**. You can think of this as having multiple flex containers stacked on top of each other, all following the same rules.

## Diagram

```
flex container
┌─────────────────────────────┐
│  ┌───┬───┬───┐              │
│  │ A │ B │ C │ ──→ main axis│
│  └───┴───┴───┘              │
│  ┌───┬───────────┐           │
│  │ D │free space │ ──→ main axis│
│  └───┴───────────┘           │
└─────────────────────────────┘
```

The diagram shows:
- A flex container with dashed border
- First row: Three items (A, B, C) aligned on the main axis
- Second row: Item D and free space, also aligned on the main axis
- Orange highlighting on the "free space" area in the second row
- Arrows pointing right labeled "main axis" for each row

---

*All content is proprietary and confidential.*

**Page 12**