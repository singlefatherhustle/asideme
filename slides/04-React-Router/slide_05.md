# Downside of using PageContext

PageContext stores the active page in state, which is wiped every time the application refreshes. What if the user wants to save a bookmark to a specific page, or share a page with a friend?

## Diagram: PageContext State Loss on Refresh

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  LEFT SIDE (Before Refresh):                           │
│  ┌──────────┐                                           │
│  │   page   │ (pink/red cylinder)                       │
│  └────▲─────┘                                           │
│       │                                                 │
│       │ 1. Change page with setPage                    │
│       │                                                 │
│  ┌────┴──────┐                                          │
│  │    App    │                                          │
│  └───────────┘                                          │
│                                                         │
│                    2. Refresh ⟳                         │
│                    (blue circular arrow)                │
│                                                         │
│  RIGHT SIDE (After Refresh):                           │
│  ┌──────────┐                                           │
│  │   page   │ (white cylinder)                          │
│  └────▼─────┘                                           │
│       │                                                 │
│       │ 3. page has been reset                          │
│       │                                                 │
│  ┌────┴──────┐                                          │
│  │    App    │                                          │
│  └───────────┘                                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Flow Description

1. **Change page with setPage** — User changes the active page using the setPage function, updating the PageContext state (shown as pink database)

2. **Refresh** — Application undergoes a refresh/reload cycle (indicated by the circular arrow)

3. **page has been reset** — After the refresh, the page state is wiped and reset to its default value (shown as white database)

---

**Footer:** All content is proprietary and confidential.

**Page Number:** 4