# The Request is Directed to the Route Handler

Express finds the corresponding router and route handler by matching the method and path of the request.

## Routing Diagram

```
POST /paintings → /paintings router → GET / handler
                                   ↓
                              /sculptures router
                                   ↓
                              /drawings handler
                                   ↓
                              POST / handler
```

**Request path:** POST /paintings

**Route matches:**
- /paintings (POST method)
- /sculptures
- /drawings
- POST / (root path)

The diagram shows how Express matches incoming requests to specific route handlers based on HTTP method (POST, GET) and path (/paintings, /sculptures, /drawings).

---

*All content is proprietary and confidential.*

Page 13