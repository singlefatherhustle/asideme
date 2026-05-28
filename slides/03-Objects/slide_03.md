# Nested arrays

Arrays can be elements in arrays! These are called **nested** arrays.

```js
const weather = [
  ["temperature", 29.4],
  ["forecast", "partly cloudy"],
  ["humidity", 0.38],
  ["precipitation", 0.16],
];

weather[0][1]; // 29.4
weather[3][0]; // "precipitation"
```

---

All content is proprietary and confidential.