# How do we make a token?

A JSON web token (JWT) is made by encoding a JSON **payload** with a **secret** key.

You can think of a token as an envelope that is sealed with wax.

- The **payload** is the piece of paper inside the envelope.
- The wax is sealed with a special **secret** stamp that only you have.
  - This process is called **signing** the token.

## Diagram

```
payload                          secret
   |                               |
   |                               |
   v                               v
[envelope icon]            [envelope with stamp icon]
```

The payload (document icon) flows into an open envelope, and the secret (person icon) flows into an envelope being sealed with a wax stamp.

---

*All content is proprietary and confidential.*

Page 10