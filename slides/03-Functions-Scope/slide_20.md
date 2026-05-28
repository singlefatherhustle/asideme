# Is a variable in scope?

## Definition

When referenced, a variable is considered to be **in scope** if it can be found on the stack and **out of scope** if it cannot be found on the stack.

## Question

At the highlighted line of code, is `xyzzy` in scope or out of scope?

**Answer:** `xyzzy` is not in scope, so there will be a reference error when trying to initialize `thud`!

## Code Example

```javascript
const foo = 5;
const bar = "hello";
function wobble(){}
const thud = xyzzy * 10;
const xyzzy = 72;
```

## Stack Visualization

**Stack (from top to bottom):**
- thud
- wobble
- bar
- foo

**Error:** ReferenceError: xyzzy is not defined

The diagram shows that when the highlighted line `const thud = xyzzy * 10;` is executed, `xyzzy` has not yet been defined on the stack. Although `xyzzy` is declared later in the code at `const xyzzy = 72;`, it is not available at the point where `thud` attempts to reference it, resulting in a ReferenceError.