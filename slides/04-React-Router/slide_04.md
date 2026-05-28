# Review

## Question

What is the purpose of `page` and `setPage` in PageContext?

## Answer

`page` represents the active page of the application that the user is currently on, which can be changed with `setPage`.

## Diagram

### PageContext Structure

```
PageContext
├── page (database icon)
└── setPage (robot icon)
```

### Component Hierarchy

```
PageContext
    ↓
PageProvider
    ↓
App
```

### Data Flow

PageContext provides `page` and `setPage` to the App component (shown by arrow from PageContext to App).

---

*All content is proprietary and confidential.*

**Page: 3**