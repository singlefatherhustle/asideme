# Review: What is a request?

A **request** contains the following elements:

- An HTTP **method** that defines the operation the client wants to perform
- The **path** of the resource (e.g. the URL)
- Optional **headers** that convey additional *metadata*
- An optional **body** that contains relevant *data*

## Request Structure Diagram

```
method                          path
  |                              |
  v                              v
┌─────────────────────────────────────┐
│            GET        /paintings    │
├─────────────────────────────────────┤
│            headers                  │
├─────────────────────────────────────┤
│             body                    │
└─────────────────────────────────────┘
```

The diagram shows the hierarchical structure of an HTTP request with:
- **method** (blue box): GET
- **path** (green box): /paintings
- **headers** (yellow box): optional metadata section
- **body** (red/pink box): optional data section

---

*All content is proprietary and confidential.*