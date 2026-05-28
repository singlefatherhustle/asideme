# GET requests

Today, we'll be focusing on the HTTP method **GET**, which indicates the client's intent to **read** some data from the server.

A GET request is also referred to as a **query**.

## Request/Response Diagram

```
GET /paintings/567
```

### Response Components

- **Status Code**: 200
- **Status Message**: OK
- **Headers**: (shown in yellow section)
- **Body** (JSON):
```json
{
  "name": "Masterpiece",
  "medium": "acrylic",
  "year": 2083
}
```

### Flow

Client → [GET /paintings/567] → Server

Server → [200 OK, headers, body] → Client

---

*All content is proprietary and confidential.*

Page: 8