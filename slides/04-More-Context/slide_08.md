# PageContext

One use case for context is keeping track of the active page.

- Which page is the user on?
- Which link is active in the navigation menu?
- Can we redirect the user to the contact page after they submit a form?

## Diagram: PageContext Architecture

```
PageProvider
     ↓
    ⋮⋮⋮
     ↓
   App

PageContext
├── page (database icon)
└── setPage (robot/function icon)
     ↓
   App
```

The diagram shows:
- **PageContext** at the top containing:
  - `page` (data storage)
  - `setPage` (function to update page)
- **PageProvider** component wrapping the application
- Data flow from PageContext through PageProvider down to the **App** component
- Arrow returning from App back to PageContext

---

*All content is proprietary and confidential.*

Page 6