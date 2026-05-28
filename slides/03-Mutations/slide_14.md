# Update

A client can send *either* a **PUT** or **PATCH** request to **update** a resource on the server. Information about the resource to update is sent in the *body* of the request as JSON.

On success, the server will send back a response with status **200 OK** and the updated resource in the body.

## Request and Response Diagram

### Request

**Method:** PUT

**Endpoint:** /paintings/567

**Headers:**
```
headers
```

**Body:**
```json
{
  "name": "Masterpiece",
  "medium": "oil",
  "year": 2083
}
```

### Response

**Status:** 200 OK

**Headers:**
```
headers
```

**Body:**
```json
{
  "name": "Masterpiece",
  "medium": "oil",
  "year": 2083
}
```

---

*All content is proprietary and confidential.*