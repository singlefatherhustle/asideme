# What is a response?

A **response** contains the following elements:

- the **status code** indicates if the request was successful or why not
- the **status message** is a short description of the status code
- the **headers**, like those for requests
- the **body**, which contains the requested information

## Response Structure Diagram

```
┌─────────────────────────────────────────┐
│         status code                     │
│            200                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         status message                  │
│             OK                          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│           headers                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│            body                         │
└─────────────────────────────────────────┘
```

---

*All content is proprietary and confidential.*