# Express Routers

As more and more endpoints get added to an Express app, it can become quite unwieldy to keep all of that code in a single file. We can use **routers** to organize related routes into separate files.

## Diagram: Express Router Architecture

```
GET /paintings
       ↓
    [client] ←→ GET /paintings → [router] ─→ GET / → [response]
       ↑                              ↓
       │                          POST /
       │
       └─────────────────────────────┘

                /sculptures
                     ↓
                  [router] ─→ GET / ─→ [response]
                              ↓
                            POST /
```

**Flow Description:**
- Client sends `GET /paintings` request
- Request routes to `/paintings` endpoint
- Router handles both GET and POST operations for `/paintings`
- Separate router handles `/sculptures` endpoint with GET and POST operations
- Response returns to client

---

*All content is proprietary and confidential.*

**Page: 8**