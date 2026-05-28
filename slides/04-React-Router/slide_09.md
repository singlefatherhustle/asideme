# How does it work?

React Router hides the implementation details from us, but underneath the hood, it's actually just a more intricate version of PageContext!

## Diagram: React Router Architecture

```
                    URL ↔ React Router → route → A
                           ↙  ↓  ↘
                        route  route
                           ↓     ↓
                           B     C
                    
                    RouteContext
                    ┌─────────────┐
                    │  setRoute   │ route
                    └─────────────┘
                           ↑
                      (magnifying glass icon)
```

**Components:**
- **URL** — The browser's URL address bar (bidirectional connection with React Router)
- **React Router** — Central routing manager with magnifying glass icon
- **RouteContext** — Contains:
  - `setRoute` (controller icon)
  - `route` (database icon)
- **Routes A, B, C** — Destination page components that receive route information

---

*All content is proprietary and confidential.*

**Page: 8**