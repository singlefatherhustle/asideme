# Function declarations are hoisted

Function declarations are **hoisted**, which means that they are moved to the top of their scope. In other words, they are added to the stack **before** everything else, regardless of where we write the functions in our code.

## Code Example

```js
const foo = 5;
function bar(){}
const wobble = 10;
function thud(){}
```

## Stack Diagram

| Layer |
|-------|
| wobble |
| foo |
| thud |
| bar |

**stack**

---

*All content is proprietary and confidential.*

**Page: 23**