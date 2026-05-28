# Treat state as read-only

In React, a state variable is treated as **immutable**, or read-only.

In other words, you should **not** reassign a new value directly to a state variable.

```js
const [count, setCount] = useState(0);
count = 5;    // BAD
setCount(5);  // GOOD
```

---

*All content is proprietary and confidential.*

**Page 4**