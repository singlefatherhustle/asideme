# Review

## Why does middleware order matter?

The first middleware to send a response will end the request-response cycle, even if a subsequent middleware function also matches.

## Diagram: Middleware Request-Response Flow

```
client → GET /paintings → (middleware chain)
           ↓
        GET /sculptures
           ↓
        GET /paintings
           ↓
        GET /paintings
           ↓
        response → (first response ends cycle)
           ↓
        client
```

The diagram shows:
- A client initiating a GET /paintings request
- Four middleware nodes (represented as spheres) processing requests in sequence:
  - GET /paintings
  - GET /sculptures  
  - GET /paintings
  - GET /paintings
- A response object returning to the client
- An arrow showing that the first middleware to send a response ends the request-response cycle, preventing subsequent middleware from executing

---

**Page 4**

All content is proprietary and confidential.