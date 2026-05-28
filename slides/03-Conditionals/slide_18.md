# If...else statements

An **if...else** statement is a conditional statement that allows our program to execute code based on a series of conditions.

## Code Example

```javascript
if (condition1) {
  // Code A
} else if (condition2) {
  // Code B
} else {
  // Code C
}
```

## Flowchart

**Diagram Structure:**

- **Node 1** (Diamond - Decision): condition1
  - **T** (True) path → **Node A** (Circle) - Code A execution
  - **F** (False) path → **Node 2** (Diamond - Decision): condition2
    - **T** (True) path → **Node B** (Circle) - Code B execution
    - **F** (False) path → **Node C** (Circle) - Code C execution

The flowchart illustrates the sequential evaluation of conditions:
1. First condition (condition1) is evaluated
2. If true, Code A executes
3. If false, the flow moves to condition2
4. If condition2 is true, Code B executes
5. If condition2 is false, Code C executes in the else block

---

*All content is proprietary and confidential.*

**Page 16**