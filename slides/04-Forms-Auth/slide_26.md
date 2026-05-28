# How do we send a token?

Once we've received a token from the API, we can now attach it to our request **headers**. We need to prepend "Bearer " to inform the API that it should attempt to use our token to authorize our request.

```
"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Request Diagram

```
request
├── GET
├── /rooms/5
├── headers
│   └── token
└── body
```

The diagram shows a client sending a request to the API with the following components:
- **Method**: GET
- **Endpoint**: /rooms/5
- **Headers section** (highlighted in orange/peach): Contains the token
- **Body section** (highlighted in red/pink): Empty for GET request

---

*All content is proprietary and confidential.*

**Page: 22**