# Prop drilling

As you lift state up, you might realize that the nearest common ancestor is really far removed from the components that need the data.

This leads to a common situation called **prop drilling**. You need to **drill** the props down through *multiple* generations of components in order for that data to reach the intended components.

## Component Hierarchy Diagram

```
                    ┌─────────────┐
                    │  (root)     │
                    └──────┬──────┘
                           │
            ┌──────────────┴──────────────┐
            │                             │
        ┌───┴────┐                    ┌───┴────┐
        │         │                    │         │
    ┌───┴──┐  ┌──┴───┐            ┌───┴──┐  ┌──┴───┐
    │ (fill)│  │(fill)│            │(empty)│  │(fill)│
    └───────┘  └──────┘            └───────┘  └───┬──┘
                                                   │
                                               ┌───┴────┐
                                               │(empty)  │
                                               └────┬────┘
                                                    │
                                            ┌───────┴────────┐
                                            │                │
                                        ┌───┴──┐          ┌──┴───┐
                                        │(fill)│          │(fill)│
                                        └──────┘          └──────┘
```

*(Blue/filled components represent those that need the data; white/empty components represent intermediate components through which props must be drilled)*

---

All content is proprietary and confidential.

**Page 12**