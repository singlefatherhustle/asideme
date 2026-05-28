# Review

## Why does middleware order matter?

The first middleware to send a response will end the request-response cycle, even if a subsequent middleware function also matches.

## Diagram: Middleware Request-Response Flow

```
client → GET /paintings → middleware (sphere icon) → GET /sculptures → middleware (sphere icon) → GET /paintings → middleware (sphere icon) → GET /paintings → middleware (sphere icon)
         ↑                                                                                                                                              ↓
         └──────────────────────────────────────────── response ←──────────────────────────────────────────────────────────────────────────────────┘
```

**Flow description:**
- Client sends initial request to GET /paintings
- Request passes through multiple middleware functions (represented by sphere icons)
- Second middleware matches GET /sculptures
- Third and fourth middleware both match GET /paintings
- First middleware to send a response ends the cycle and returns response to client
- Subsequent matching middleware functions are not executed

---

*All content is proprietary and confidential.*

**Page: 3**