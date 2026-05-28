# Delete

A client can send a **DELETE** request to delete a resource on the server.

On success, the server will send back a response with status **204 No Content**.

## Request/Response Diagram

```
DELETE /paintings/567
```

**Request:** Client sends DELETE request to `/paintings/567` endpoint on server

**Response:** Server returns `204 No Content` status

### Visual Flow

```
client ──DELETE /paintings/567──> server
       <────204 No Content────────
```

---

*All content is proprietary and confidential.*

**Page: 13**