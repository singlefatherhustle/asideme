# Reduce

## Definition

**reduce** combines elements from the original array into a single value. It executes a **reducer** function on each element, passing in the result of the *previous* element's calculation.

## Code Example

```javascript
const nums = [-5, -4, 3, 1, 18];
const add = (accumulator, current) => accumulator + current;
nums.reduce(add, 0); // 13
```

## Visual Diagram

### Process Flow

**Initial Value:** 0

**Array (nums):** [-5, -4, 3, 1, 18]

**Reducer Function:** add

**Step-by-step Accumulation:**

| Step | Current Value | Accumulator | Result |
|------|---------------|-------------|--------|
| 1 | -5 | 0 | -5 |
| 2 | -4 | -5 | -9 |
| 3 | 3 | -9 | -6 |
| 4 | 1 | -6 | -5 |
| 5 | 18 | -5 | 13 |

The diagram shows:
- A robot icon labeled "reduce" on the left
- A robot icon labeled "add" (the reducer function) in the middle
- The initial value (0) flowing into the process
- Each element of the nums array being processed sequentially
- The accumulator values being updated at each step
- Green boxes showing the accumulator results: -5, -9, -6, -5, 13
- Arrows showing the flow of data through the reduction process

---

*All content is proprietary and confidential.*

Page: 16