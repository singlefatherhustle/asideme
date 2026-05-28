# A mutually agreed-upon interface

In this context, a mutually agreed-upon interface (the server's API) is a list of **endpoints**.

An **endpoint** identifies the HTTP method and path of a request that the server will accept and respond to.

## API Diagram

```
┌─────────────────────────────────┐
│            API                  │
├─────────────────────────────────┤
│  GET /paintings        ●──────┐ │
│                                │ │
│  GET /drawings         ●──────┤─┼─── OK ───┐
│                                │ │          │
│  GET /sculptures       ●──────┘ │          │
│                                │ │          │
│  GET /cookies          ●──────┐ │          │
│                                │ │          │
└─────────────────────────────────┘ │      ERROR
                                     │          │
      server                      client       │
                                     ▲         │
                                     └─────────┘
```

---

*All content is proprietary and confidential.*

**Page: 11**