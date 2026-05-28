# Review

## What is a server's API?

A server's API (application programming interface) is a defined set of **endpoints** that specify where and how clients can send requests.

## Diagram: Server API Endpoints

```
┌─────────────────────────────────┐
│            API                  │
├─────────────────────────────────┤
│  GET /paintings         ●────OK──┐
│                                  │
│  GET /drawings          ●────────┼──→ client
│                                  │
│  GET /sculptures        ●────────┤
│                                  │
│  GET /cookies          ●────ERROR┘
└─────────────────────────────────┘
        server
```

### Endpoint Structure:
- **GET /paintings** → OK
- **GET /drawings** → OK
- **GET /sculptures** → OK
- **GET /cookies** → ERROR

---

**Footer:** All content is proprietary and confidential. | Page 3