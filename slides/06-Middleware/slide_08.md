# Error-handling middleware

Ideally, errors are handled as close as possible to the middleware where the error occurs.

What happens if an error happens that we were **not** anticipating?
We still want to **gracefully** handle it without crashing our server.

**Error-handling middleware** functions live at the very end, **after** all other middleware functions. They serve as the last line of defense.

## Diagram: Error-handling Middleware Flow

```
client → GET /paintings → GET /paintings → POST /paintings → error-handling middleware → response → client
                              (with error indicator)
```

**Components:**
- **client**: Request origin
- **GET /paintings**: First middleware function
- **GET /paintings**: Second middleware function (marked with error indicator "!")
- **POST /paintings**: Third middleware function
- **error-handling middleware**: Final middleware in the chain
- **response**: Return path to client

The diagram shows a request flowing through multiple middleware functions left to right, with an error occurring at one of the early middleware stages, then routing to the error-handling middleware at the end, which sends the response back to the client.

---

*All content is proprietary and confidential.*

Page 7