# Blocks push frames onto the stack

A **block** of code in JavaScript is denoted by curly braces, such as the body of a conditional or a function. These push **frames** onto the stack, which you can think of as mini-stacks.

At the highlighted line of code, is `foo` in scope or out of scope?

## Code

```js
const foo = 5;
if (foo < 10){
  const bar = 10;
  const wobble = bar + foo;
}
```

## Stack Diagram

The diagram shows a stack structure with three levels:

- **Stack** (outermost container)
  - **foo** (bottom level)
  - **frame** (middle level, highlighted in blue, containing):
    - wobble
    - bar
  - (top level, empty space)

---

*All content is proprietary and confidential.*

**Page: 20**