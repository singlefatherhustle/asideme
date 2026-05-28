# Express routes requests

Express gives us the tools to **route** requests through a series of **middleware** functions until *one of them* sends back a response. They are called middleware functions because they happen in the *middle* of the **request-response cycle**.

## Request-Response Cycle Diagram

```
client → request → middleware function → middleware function → middleware function
  ↑                                                                        ↓
  └────────────────── response ──────────────────────────────────────────┘
```

**Diagram Structure:**
- **Client**: Computer/device initiating the request (left side)
- **Request**: Arrow showing request flow from client to the first middleware
- **Middleware functions**: Three processing nodes (represented as gears/cogs) arranged sequentially
- **Response**: Arrow showing response flow back from the last middleware to the client
- The cycle forms a complete loop from client through all middleware functions and back to client

---

*All content is proprietary and confidential.*

**Page: 10**