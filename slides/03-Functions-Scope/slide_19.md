# Is a variable in scope?

## Definition

When referenced, a variable is considered to be **in scope** if it can be found on the stack and **out of scope** if it *cannot* be found on the stack.

## Question

At the highlighted line of code, is `xyzzy` in scope or out of scope?

## Code

```javascript
const foo = 5;
const bar = "hello";
function wobble(){}
const thud = xyzzy * 10;
const xyzzy = 72;
```

---

*All content is proprietary and confidential.*

Page 19