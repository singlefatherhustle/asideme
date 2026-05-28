# Promise is fulfilled

Some time later, if the operation was successful, then the promise will be **fulfilled** with a value.

## Code

```javascript
const coffee = getCoffee();

coffee = Promise {
  state: fulfilled,
  value: ☕
}
```

## Diagram

A flowchart showing:
- **Developer** (left stick figure) says "Thanks!"
- **Promise** (center hexagon labeled "coffee")
- **Friend** (right stick figure) says "Here's your coffee!"
- The Promise object contains the coffee value (☕)
- Arrows indicate the interaction between Developer, the Promise, and Friend

---

*All content is proprietary and confidential.*

Page 20