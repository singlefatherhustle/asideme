# Handling credentials

We have to store passwords in our database in order to confirm that a user is giving us the correct credentials. What's the problem with storing **plaintext** passwords?

## Diagram: Password Flow

```
client ──p@ssw0rd──> API ──p@ssw0rd──> Database
```

- **Client**: Computer/device initiating login
- **API**: Server processing authentication request
- **Database**: Storage system containing user credentials

---

*All content is proprietary and confidential.*

**Page: 5**