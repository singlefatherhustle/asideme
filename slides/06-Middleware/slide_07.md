# Body-parsing middleware

A request may also have some information contained in the request **body**. Request bodies are not read by default!

Instead, **body-parsing middleware** is required to parse the request body into a format that other middleware functions can interact with.

## Diagram: Body-parsing Middleware Flow

```
client 
  ↓
  → POST /paintings → [body] → body-parsing middleware → [body] → POST /paintings →
  ↑                                                                    ↓
  └─────────────────── response ←──────────────────────────────────────
```

### Components:
- **client**: Request origin
- **POST /paintings**: HTTP endpoint
- **body**: Raw request body (database cylinder)
- **body-parsing middleware**: Processing node (blue sphere) that transforms the body
- **body**: Parsed request body (green cylinder)
- **POST /paintings**: Route handler (blue sphere)
- **response**: Response sent back to client

---

*All content is proprietary and confidential.*

**Page 6**