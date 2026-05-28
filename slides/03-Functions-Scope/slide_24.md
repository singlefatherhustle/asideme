# Look out, not in

The general rule of thumb is that you can *look out* to reference variables in the **global scope**, but you can't *look in* to reference variables in **block scope**.

**wobble** can look *out* to reference **foo**, but **thud** can't look *in* to reference **wobble**.

```js
const foo = 5;
if (foo < 10){
  const bar = 10;
  const wobble = bar + foo;
}
const thud = wobble + 1;
```

---

All content is proprietary and confidential.

Page 22