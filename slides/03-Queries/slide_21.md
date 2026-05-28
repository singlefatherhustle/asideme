# Promise is rejected

What happens if the operation is unsuccessful? The promise will now be **rejected** with a *reason* instead of a value.

## Code Example

```javascript
const coffee = getCoffee();

coffee = Promise {
  state: rejected,
  reason: "Forgot wallet"
}
```

## Diagram

**Characters involved:**
- Developer (left figure)
- Promise (hexagon shape in center)
- Friend (right figure)

**Interaction:**
- Developer says: "Oh..."
- Friend says: "Sorry, I forgot my wallet."
- The Promise object is shown between them, labeled "coffee"

---

*All content is proprietary and confidential.*

Page: 21