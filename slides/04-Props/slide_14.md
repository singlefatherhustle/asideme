# How do you pass an argument into props?

The same as passing an argument into any other function: when the function is **called**.

If we want an avatar for Lin Lanying that's 100px wide, we can pass an object with that information as the argument to props, like so:

```jsx
function Avatar({name, size}){...}

Avatar({name: "Lin Lanying", size: 100});
```

---

All content is proprietary and confidential.

Page 10