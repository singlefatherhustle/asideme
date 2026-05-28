# Break it down

## Code

```javascript
const baz = speak("baz");
```

## Explanation

1. The string `"baz"` is passed as an argument to the higher-order function `speak`.
2. `speak` returns an anonymous function that will print `"baz"` when called.
3. That anonymous function value is assigned to a variable named `baz`.

## Diagram

```
"baz" → speak → anonymous → baz
                   (box)
```

**Flow Description:**
- Input: The string `"baz"` flows into the `speak` function (represented by a robot icon)
- Process: `speak` processes the input and returns an anonymous function (represented by another robot icon inside a box)
- Output: The anonymous function is assigned to the variable `baz`

---

*All content is proprietary and confidential.*

Page 10