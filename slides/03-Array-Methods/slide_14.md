# Map

## Definition

**map** *transforms* an array. It returns a new array where each element is the result of passing the original element into the given callback function.

## Code Example

```js
const nums = [-5, -4, 3, 1, 18];
const double = (n) => n * 2;
nums.map(double); // [-10, -8, 6, 2, 36]
```

## Diagram

### Input Array (nums)

| -5 | -4 | 3 | 1 | 18 |

### Process

```
map → double (callback function)
```

Each element flows through the `map` function which applies the `double` callback to transform it.

### Output Array

| -10 | -8 | 6 | 2 | 36 |

---

*All content is proprietary and confidential.*

Page: 14