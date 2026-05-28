# Filter

## Definition

**filter** selects some items from an array. It returns a new array consisting of elements for which the callback function returns true.

## Code Example

```js
const nums = [-5, -4, 3, 1, 18];
const isPositive = (n) => n > 0;
nums.filter(isPositive); // [3, 1, 18]
```

## Diagram

### Input Array
| -5 | -4 | 3 | 1 | 18 |

### Process
The diagram shows:
- **filter** function (represented by robot icon on left)
- **isPositive** callback function (represented by robot icon in middle)
- Each element evaluated:
  - -5: F (false)
  - -4: F (false)
  - 3: T (true)
  - 1: T (true)
  - 18: T (true)

### Output Array
| 3 | 1 | 18 |

---

*All content is proprietary and confidential.*

**Page: 15**