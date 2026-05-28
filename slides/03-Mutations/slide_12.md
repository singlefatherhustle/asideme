# Create

A client can send a **POST** request to **create** a resource on the server. Information about the resource to create is sent in the *body* of the request as JSON.

On success, the server will send back a response with status **201 Created**.

## Diagram

```
POST /paintings

headers

{
  "name": "Masterpiece",
  "medium": "acrylic",
  "year": 2083
}
```

**Flow:**
- Client sends POST request to `/paintings` endpoint
- Request includes headers and JSON body with painting details
- Server receives request and creates resource
- Server responds with `201 Created` status code

---

*All content is proprietary and confidential.*