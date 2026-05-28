# Pending promise

The foundation of asynchronous programming in JavaScript is the **Promise**.

You can think of a **Promise** as an object with a *state* and a *value*.
It represents the *eventual result* of an asynchronous operation.

```javascript
const coffee = getCoffee();

coffee = Promise {
    state: pending,
    value: undefined
}
```

## Diagram: Promise Flow

A diagram shows a conversation between a Developer and a Friend, with a Promise object in the middle:

- **Developer** (left): "Hey, can you get me a cup of black coffee?"
- **Friend** (right): "Sure! I'll run to the cafe now."
- **Promise** (center hexagon labeled "coffee"): Represents the pending state of obtaining the coffee

The diagram illustrates the relationship between:
- Developer (requester)
- Promise (the commitment/object)
- Friend (executor)

---

*All content is proprietary and confidential.*

Page 19