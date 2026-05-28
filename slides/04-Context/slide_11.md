# Provide context values

Next, we need to make a **Provider** component with two main jobs:

1. Put a **value** into the context.
   a. If we want *multiple values*, we can make `value` an array or an object.
2. **Provide** that value to its children.

## Diagram

```
                    ┌─────────────────────┐
                    │     context         │
                    │                     │
                    │      value          │
                    │   (database icon)   │
                    └─────────────────────┘
                              ▲
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    │     Provider       │
                    │                    │
                    └────────────────────┘
                              │
                           provides
                              ▼
```

---

*All content is proprietary and confidential.*

**Page 8**