# Iterate through an object's properties

We iterate through an object using a **for...in** loop. This is different from the **in** operator!

```js
for (const property in weather) {
    const value = weather[property];
    console.log(property, value);
}
```

## Why is it important to use bracket notation instead of dot notation?

The property name will be different in each iteration of the loop.

---

*All content is proprietary and confidential.*

Page 11