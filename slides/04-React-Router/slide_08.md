# What is React Router?

**React Router** is a routing library. It uses the URL to remember the **route**, which determines the components that should be rendered.

## Diagram: React Router Flow

```
┌─────────────┐
│    URL      │
└──────┬──────┘
       │
       ↔
       │
    ┌──────────────────┐
    │  React Router    │
    └──────┬───────────┘
           │
    ┌──────┴──────┬──────────┬──────────┐
    │             │          │          │
    ↓             ↓          ↓          ↓
  route        route      route      route
    │             │          │          │
    ↓             ↓          ↓          ↓
 ┌─────┐      ┌─────┐   ┌─────┐
 │  A  │      │  B  │   │  C  │
 └─────┘      └─────┘   └─────┘
```

The diagram shows:
- **URL** on the left connected to **React Router**
- **React Router** in the center with three route branches
- Each route points to a component (A, B, or C)

---

*All content is proprietary and confidential.*

Page 7