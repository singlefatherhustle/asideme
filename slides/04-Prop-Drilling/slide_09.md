# Add to the copy

The spread operator also allows you to quickly add something to the copy.

```js
const numbers = [7, 8, 9];
const numbersCopy = [6, ...numbers, 10];
```

Additionally, you can overwrite existing properties when you spread an object.

```js
const drink = { flavor: "lychee", size: "16oz" };
const drinkCopy = {...drink, size: "12oz", color: "white"};
```

---

All content is proprietary and confidential.