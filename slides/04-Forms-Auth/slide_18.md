# Verify your identity

The API will then **authenticate** the request by checking the credentials against the database. If everything looks good, the API will respond with **200 OK** and a **token**.

## Diagram

```
Client ←— token —→ API —checks→ database
                    ↑
                  200 OK
```

### Components:
- **Client**: User/application making the request
- **token**: Key/credential returned upon successful authentication
- **API**: Service that authenticates the request
- **database**: Storage containing credentials to verify against

### Flow:
1. Client sends credentials
2. API checks credentials against database
3. Database validates credentials
4. API responds with "200 OK" status
5. API returns a token to the client

---

*All content is proprietary and confidential.*

**Page: 15**