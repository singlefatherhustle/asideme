# What if we care about the previous value?

```
n = n + 1;
```

The **left-hand side** of the assignment operator is always a **reference**.
- `n`, as a reference, means the *variable n*.
- In other words, the memory address that `n` points to.

The **right-hand side** of the assignment operator is always a **value**.
- `n`, as a value, means *the value of the variable n*.
- In other words, the value stored at the memory address that `n` points to.

The right-hand side is always evaluated first!

---

*All content is proprietary and confidential.*

Page 20