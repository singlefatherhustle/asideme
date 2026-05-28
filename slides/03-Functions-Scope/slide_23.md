# Frames are pushed off the stack

Once a block closes, its frame is pushed off the stack. That means any variables declared inside the block **disappear** and cannot be referenced afterward!

## Code Example

```javascript
const foo = 5;
if (foo < 10){
    const bar = 10;
    const wobble = bar + foo;
}
const thud = wobble + 1;
```

## Diagram

**Stack and Memory Layout:**

The diagram shows:
- **Stack** (left side): Contains `foo` variable at the bottom
- **Frame** (right side): Contains `wobble` and `bar` variables
- **Garbage** (far right): A bucket representing where `wobble` and `bar` are moved after the if block closes

**Error Annotation:** 
`ReferenceError: wobble is not defined` — This error occurs when trying to reference `wobble` outside its scope after the if block closes and its frame is popped off the stack.

---

*All content is proprietary and confidential.*

Page 21