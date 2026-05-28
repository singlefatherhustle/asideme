# Middleware order matters

The **first** middleware to **send a response** will end the request-response cycle, **even if a** subsequent middleware function **also** matches.

## Diagram: Middleware Request-Response Flow

```
client → GET /paintings → GET /sculptures → GET /paintings → GET /paintings
           ↓                ↓                 ↓                ↓
        [middleware]    [middleware]     [middleware]     [middleware]
           ↓                ↓                 ↓                ↓
           └─────────────────────────────────┘
                        response ← (first to send)
           ↓
        client
```

**Flow description:**
- Client sends request starting with `GET /paintings`
- Request passes through middleware chain (left to right)
- First middleware to send a response ends the cycle
- Response returns to client
- Subsequent middleware functions do not execute

---

*All content is proprietary and confidential.*

**Page 12**