# Set watch expressions

While the code is paused, you can specify a **watch expression**, which is reevaluated and displayed every time the debugger pauses. In other words, the debugger will **watch** the expression and return any results.

## Code Example

```js
let i = 0;
while (i < 3) {
  debugger;
  console.log("Counting..." + i);
  i += 1;
}
```

## Debugger Interface

**Status:** Paused on debugger statement
- **(global) – index.js:3:2**

**Watch expressions panel:**
- `i: 0`

**Additional sections:**
- Breakpoints

---

*All content is proprietary and confidential.*

**Page number:** 19