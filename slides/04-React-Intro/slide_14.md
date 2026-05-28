# How does React work?

React actively monitors every piece of state in an application.

1. A change in state will **trigger** a render.
2. React **renders** every component that depends on the changed state.
   a. In this context, *rendering* only means calling the component function.
3. React compares the output with what is already in the DOM.
4. Only the differences are **committed** to the DOM.

## Process Flow Diagram

```
state → trigger → React → render → component → commit → DOM
```

**Components in the flow:**
- **state** (database icon)
- **trigger** (arrow label)
- **React** (atom/molecule icon)
- **render** (arrow label)
- **component** (rectangle box)
- **commit** (arrow label)
- **DOM** (circular target/sphere icon)

---

*All content is proprietary and confidential.*

Page: 10