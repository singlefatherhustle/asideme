# Use the token

The client can now use the token to access protected resources, such as going to their room or the pool.

## Diagram: Token Usage Flow

```
Client --[token]--> /rooms/5
         (key icon)

Client --[token]--> /pools/1
         (key icon)
```

**Components:**
- **Client** (stick figure) - on the left
- **token** (key icon) - in the middle, connecting client to resources
- **/rooms/5** (3D box) - protected resource on the right
- **/pools/1** (3D box) - protected resource on the right

Two parallel flows shown, each demonstrating a client using a token to access a different protected resource.

---

*All content is proprietary and confidential.*

**Page: 17**