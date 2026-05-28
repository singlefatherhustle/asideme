# console.log is not the same as return

Only the **return** keyword will return a value from a function.
If there is no **return**, then the function invocation evaluates to **undefined**.

## Code Example

```js
function subtract(num1, num2) { console.log(num1 num2); }
const difference = subtract(2,7);
```

## Diagram: Function Execution Flow

```
Inputs:
├── num1: 2
├── num2: 7

Function: subtract
│
├── console.log(num1 num2) → outputs: -5
│
└── return statement: ❌ (missing)
    └── Robot icon (function processor)

Output:
└── difference: undefined
```

### Variable States After Execution

| Variable | Value |
|----------|-------|
| difference | undefined |
| (console output) | -5 |
| num1 | 2 |
| num2 | 7 |

---

**Page:** 11