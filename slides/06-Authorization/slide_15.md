# Potential danger

## What happens if a server's secret key is leaked?

Someone *else*, who is *not* the server, can use the key to put any payload they want into the token, and the server will think that token is legitimate.

## Diagram: Token Forgery Attack

```
[Attacker with devil emoji] 
    ↓
[Computer] → [Token with key] → [Server]
                                    ↓
                               [Server emoji says "OK"]
                                    ↓
                               [Server emoji (concerned)]
```

**Components labeled:**
- Computer (left, attacker's device)
- Token (center, with key icon)
- Server (right)

---

*All content is proprietary and confidential.*

Page 13