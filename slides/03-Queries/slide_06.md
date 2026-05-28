# What is a request?

A request contains the following elements:

- An HTTP **method** that defines the operation the client wants to perform
- The **path** of the resource (e.g. the URL)
- Optional **headers** that convey additional *metadata*
- An optional **body** that contains relevant *data*

## Request Structure Diagram

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  method              path                       │
│  ┌──────────┐      ┌──────────────┐            │
│  │   GET    │      │  /paintings  │            │
│  └──────────┘      └──────────────┘            │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │           headers                       │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │           body                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

*All content is proprietary and confidential.*

Page 6