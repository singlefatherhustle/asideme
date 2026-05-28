# Check if an object has a key

We use the `in` operator to check if a key exists.

```js
const weather = {
  temperature: 29.4,
  forecast: "partly cloudy",
  humidity: 0.38,
  precipitation: 0.16,
};

"humidity" in weather;     // true
"wind" in weather;         // false
```