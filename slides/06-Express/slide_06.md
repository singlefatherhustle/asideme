# Review

## What is a server's API?

A server's API (application programming interface) is a defined set of **endpoints** that specify where and how clients can send requests.

## API Diagram

```
                          ┌─────────────────────────┐
                          │         API             │
                          ├─────────────────────────┤
                          │  GET /paintings      OK  │
                          │  GET /drawings       OK  │
                          │  GET /sculptures     OK  │
                          │  GET /cookies      ERROR │
                          └─────────────────────────┘
                                    ↑
                     ┌──────────────┼──────────────┐
                     │              │              │
                  server         client         
```

### Endpoints shown:
- `GET /paintings` → OK
- `GET /drawings` → OK
- `GET /sculptures` → OK
- `GET /cookies` → ERROR (highlighted in red)

---

**Note:** All content is proprietary and confidential.

**Page:** 4