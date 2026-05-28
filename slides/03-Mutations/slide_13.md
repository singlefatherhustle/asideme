# Read

You already know how to **read** a resource from a server: by sending a **GET** request!
Do not send anything in the body of a GET request.

On success, the server will send back a response with status **200 OK** and the requested resource in the body.

## HTTP Request/Response Diagram

```
GET /paintings/567
```

### Response Components

| Component | Content |
|-----------|---------|
| Status Code | 200 |
| Status Message | OK |
| Headers | (headers) |
| Body | `{ "name": "Masterpiece", "medium": "acrylic", "year": 2083 }` |

### Diagram Flow

- **Client** sends: `GET /paintings/567`
- **Server** responds with:
  - Status: 200 OK
  - Headers
  - Body (JSON):
    ```json
    {
      "name": "Masterpiece",
      "medium": "acrylic",
      "year": 2083
    }
    ```

---

*All content is proprietary and confidential.*

Page 10