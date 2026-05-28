# Higher-order functions

Functions can be passed as arguments to **higher-order** functions. These input functions are often referred to as **callback functions**.

## Code Example

```js
// repeat is a higher-order function
function repeat(fn, n) {
  for (let i = 0; i < n; i++) {
    fn();
  }
}

repeat(foo, 5); // The callback function here is foo
repeat(bar, 5); // The callback function here is bar
```

---

*All content is proprietary and confidential.*

Page 6