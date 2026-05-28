# Consume context values

## Main Concept

Any descendant component of the provider component, no matter how far, can now **consume** the value from the context with a **hook**.

A **hook** allows a component to access a React feature that lives *outside* of the component.

## Diagram: Context Consumption Flow

```
                          ┌─────────────────┐
                          │    context      │
                          │                 │
                          │     value       │
                          └────────┬────────┘
                                   │
                    ┌──────────────┤
                    │              │
                ┌───┴──────┐       │
                │ Provider │       │
                └────┬─────┘       │
                     │             │
                   provides        │
                     │             │
            ┌────────┴─────┐       │
            │      ...     │       │
            │  many        │       │
            │ generations  │       │
            │      ...     │       │
            └────────┬─────┘       │
                     │             │
                ┌────┴──────┐      │
                │ Consumer  │◄─────┤
                └───────────┘   consumes
```

### Flow Description:
- The **context** sits at the top, containing a **value**
- The **Provider** component provides access to the context
- Multiple generations of nested components can exist between the Provider and Consumer
- The **Consumer** component (no matter how deeply nested) can **consume** the value from the context using a hook

---

*All content is proprietary and confidential.*

Page 9