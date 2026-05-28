# The Route Handler Sends a Response

Once the database results are returned from the query function, the route handler uses that data to construct a response to send back to the client.

## Process Flow Diagram

```
createPainting → painting → POST / → painting → client
                (box)    (sphere)  (diamond)  (computer)
                                   201 Created
```

### Components:

- **createPainting**: Robot/automation icon (initiator)
- **painting**: Light green cube (data model)
- **POST /**: Blue sphere with needle/pin (HTTP method)
- **painting**: Light green cube in diamond shape (response data)
- **201 Created**: HTTP status code label
- **client**: Computer/desktop icon (recipient)

---

*All content is proprietary and confidential.*

Page 17