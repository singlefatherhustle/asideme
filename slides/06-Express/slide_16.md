# Middleware functions don't need to respond

Didn't we just say that Express routes requests through a *series of middleware*?

A middleware function ends the request-response cycle *only if* it sends a response, but it doesn't need to! We'll explore this idea more in an upcoming lesson.

## Diagram: Middleware Request-Response Flow

```
client
  ↓
  → GET /paintings → sphere (middleware) → sphere (middleware) → sphere (middleware) → GET /paintings
                         ↓                      ↓                      ↓
                    GET /sculptures       GET /sculptures         GET /paintings
                         ↓                      ↓                      ↓
                    (passes through)      (passes through)        response ←
                                                                      ↓
                                                                   client
```

The diagram illustrates:
- A client sends a GET request to `/paintings`
- The request passes through a series of middleware functions (represented as spheres)
- Each middleware can process the request and pass it along to the next middleware
- Only the final middleware sends a response back to the client
- The response flows back from the last middleware to the client

---

*All content is proprietary and confidential.*