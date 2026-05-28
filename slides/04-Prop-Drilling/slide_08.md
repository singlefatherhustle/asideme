# The spread operator

The **spread operator (`...`)** takes items *out of* their container. If you put those items into a *new* container, you've just made a copy!

## Examples

```js
const numbers = [7,8,9];

// Take 7, 8, 9 out of numbers and put them into a new array [ ]
const numbersCopy = [...numbers];
```

```js
const drink = { flavor: "lychee", size: "16oz" };

// Take flavor and size out of drink and put them into a new object { }
const drinkCopy = {...drink};
```

---

*All content is proprietary and confidential.*