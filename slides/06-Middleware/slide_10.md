# Recap

A typical Express app is composed of many different kinds of middleware!

## Middleware Flow Diagram

```
request
   ↓
   ↓→ logging middleware
         ↓
         ↓→ body-parsing middleware
                ↓
                ├→ /foo
                │  ↓
                │  ├→ GET /
                │  └→ POST /
                │
                └→ /bar
                   ↓
                   ├→ GET /
                   └→ POST /
                        ↓
                        ↓ (error)
                        ↓
                   error-handling middleware
                        ↓
                        response (error)
```

## Key Components

- **client** — sends request
- **request** — incoming HTTP request
- **logging middleware** — logs request details
- **body-parsing middleware** — parses request body
- **/foo** — route handler
- **/bar** — route handler
- **GET /** — HTTP GET method
- **POST /** — HTTP POST method
- **response** — response sent back to client
- **error-handling middleware** — catches and handles errors
- **response (error)** — error response sent to client

---

*All content is proprietary and confidential.*

Page 9