# Pass the baton to the database layer

Once the request has been routed to the correct handler, it's time for the database layer to do its job! The POST `/paintings` route handler passes information from the request body into the corresponding database query function, which in this case is `createPainting`.

## Diagram

Flow showing three connected components:

1. **POST /** (represented by a baton icon)
2. **painting** (represented by a cube/box)
3. **createPainting** (represented by a robot icon)

The diagram shows arrows flowing left to right, illustrating the progression from the POST request through the painting route to the createPainting database function.

---

*All content is proprietary and confidential.*

Page 14