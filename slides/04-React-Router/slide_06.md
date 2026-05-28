# Store state in the URL

One solution is to store the page state in the **URL**, instead of in context. Even if the application refreshes, it can restore the active page by reading the URL.

## Diagram: State Storage Flow

```
                    ┌─────────────────┐
                    │   Browser       │
                    │  (with cursor)  │
                    └────────┬────────┘
                             │
                             │
            ┌────────────────┴────────────────┐
            │                                 │
            ▼                                 ▼
    ┌──────────────────┐          ┌──────────────────┐
    │      App         │          │  www.example.com │
    │                  │          │     /about       │
    └──────────────────┘          └──────────────────┘
            ▲                                 │
            │                                 │
            │                                 │
    ┌───────┴────────────┐          ┌────────┴────────┐
    │                    │          │                 │
    │ 1. Put "about"     │          │ 3. Read "about" │
    │    into URL        │ 2.Refresh│    from URL     │
    │                    │          │                 │
    └────────────────────┘          └─────────────────┘
            │                                 │
            └────────────────────────────────┘
                   (refresh cycle arrow)
```

The flow shows:
1. **App** puts "about" into the URL
2. **Refresh** occurs (circular arrow indicating application refresh)
3. **App** reads "about" from the URL to restore state

**URL Reference:** `www.example.com/about`

---

*All content is proprietary and confidential.*

**Page:** 5