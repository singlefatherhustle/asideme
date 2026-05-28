# Matching endpoints

Middleware functions are identified by their **method** and their **route** (or **path**). Express will route a request only to middleware functions with a *matching* method **and** path.

## Diagram: Request Routing Flow

```
Client → [Request router] → GET /paintings → GET /sculptures → POST /paintings → GET /paintings
                                    ↓              ↓              ↓              ↓
                                 (sphere)      (sphere)       (sphere)       (sphere)
                                    ↓              ↓              ↓              ↓
                                 response ←───────────────────────────────────────
```

The diagram shows:
- A **client** on the left sending a request
- A **request router** (zigzag shape) that distributes incoming requests
- Four middleware endpoint options displayed as spheres with labels:
  1. GET /paintings
  2. GET /sculptures
  3. POST /paintings
  4. GET /paintings
- A **response** path returning to the client
- An arrow from the top showing the request being routed down to the matching endpoint
- A return arrow showing the response flowing back to the client

---

*All content is proprietary and confidential.*

Page 11