# Values get put on the heap

Each entry in the stack points to a position in the **heap**, which is where values are stored. You can think of this like a *heap* of laundry.

```javascript
const foo = 5;
const bar = "hello";
function wobble(){}
```

## Diagram: Stack and Heap Memory Layout

**Stack** (left box):
- wobble (function)
- bar (variable)
- foo (variable)

**Heap** (right box):
- 5 (numeric value)
- "hello" (string value)
- Robot icon (function reference)

**Connections:**
- Stack entry `foo` points via blue arrow to heap value `5`
- Stack entry `bar` points via green arrow to heap value `"hello"`
- Stack entry `wobble` points via orange arrow to heap function reference (robot icon)

---

*All content is proprietary and confidential.*

**Page: 18**