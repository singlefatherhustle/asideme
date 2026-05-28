# Recursive function anatomy

A **base case** is when a function can return an answer right away very easily without having to do any work. A **recursive case** is when a function does some work with the solution to a smaller case.

```javascript
function sum(n){
    // Base case
    if (n <= 1) return n;

    // Recursive case
    return sum(n-1) + n;
}
```

---

All content is proprietary and confidential.