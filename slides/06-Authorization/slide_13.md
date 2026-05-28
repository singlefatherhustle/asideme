# What's the point of JWT then?

The purpose of using a JWT is to help the server **verify the *legitimacy*** of the payload.

If a client tries to send a token with the **wrong** key, the server will not trust it.

## Diagram: JWT Verification Flow

```
Client → Token → Server
  ↓              ↓
(User 1)    (Key icon)    (User 2)
  ✗ ────────────────────────── ✗
```

**Labels:**
- Left device: `client`
- Center object: `token`
- Right device: `server`
- Top left user (circled): rejected connection
- Top right user (circled): rejected connection

---

*All content is proprietary and confidential.*

**Page: 12**