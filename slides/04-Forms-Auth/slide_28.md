# Recap

## Authentication

1. A user types their username and password into a form and submits it.
2. The form **action** sends the user's **credentials** to the API.
3. The API verifies the credentials and responds with a **token** (a string).

## Authorization

1. A request is made to the API with a **token** attached to the headers.
2. The API checks if the token **authorizes** access to the resource.
   a. If authorized, the API sends back a success response.
   b. If not authorized, the API sends back a 401 Unauthorized error.

---

*All content is proprietary and confidential.*

**Page: 24**