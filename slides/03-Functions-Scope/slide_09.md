# Return

In addition to taking input, functions can also **return** a single output value when called. In other words, a function invocation is an expression that evaluates to the single value that the function returns.

```js
function subtract(num1, num2) { return num1 - num2; }
const difference = subtract(7,2);
```

## Diagram: Function Return Flow

**Structure:**
- Left side: `difference` (output variable/storage box)
- Center: `subtract` (function/robot icon)
- Right side: `num1` (input box with value 7) and `num2` (input box with value 2)
- Arrow from `num1` (7) → `subtract` function
- Arrow from `num2` (2) → `subtract` function
- Arrow labeled "return" from `subtract` function → value `5` (output box)
- Arrow from value `5` → `difference` (output storage)

**Elements:**
- Input parameters: `num1: 7`, `num2: 2`
- Function: `subtract`
- Return value: `5`
- Output variable: `difference`

---

All content is proprietary and confidential.