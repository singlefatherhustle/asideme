# Argument order matches parameter order

Be careful when passing arguments into a function! When a function is called, the order of the arguments is matched to the order of the parameters.

## Code Example

```javascript
function subtract(num1, num2) { return num1 - num2; }
const difference = subtract(2,7);
```

## Diagram

**Flow of execution:**

- **Arguments passed:** 2, 7
- **Parameters:** num1, num2
- **Mapping:**
  - num1 ← 2
  - num2 ← 7
- **Calculation:** num1 - num2 = 2 - 7 = -5
- **Return value:** -5
- **Result stored in:** difference

**Visual representation:**
- Arguments box (right): contains 2 and 7
- Function "subtract" (center): robot icon
- Parameters box (left): num1 and num2
- Return value: -5 flows back to difference variable

---

*All content is proprietary and confidential.*

Page 10