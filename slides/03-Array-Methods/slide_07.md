# First-class vs higher-order

`foo` is a first-class function that is passed as the argument to the `fn` parameter of `repeat`, which is a higher-order function.

## Diagram

```
┌─────────────┐         ┌─────┐
│             │         │     │
│    foo      │         │  5  │
│  (robot)    │         │     │
│             │         │     │
└──────┬──────┘         └──┬──┘
       │ fn                │ n
       └────────┬──────────┘
                │
            ┌───▼────┐
            │  repeat │
            │ (robot) │
            └─────────┘
```

**Elements:**
- `foo` (robot icon) - First-class function, left input
- `5` - Number value, right input  
- `fn` - Parameter label for function argument
- `n` - Parameter label for number argument
- `repeat` (robot icon) - Higher-order function, receives both inputs

---

*All content is proprietary and confidential.*

Page 7