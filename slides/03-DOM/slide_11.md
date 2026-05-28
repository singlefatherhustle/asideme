# Why work with the DOM?

We can already build websites with HTML and CSS, so why JavaScript?

JavaScript and the DOM allows us to **dynamically** update a website based on changing data **without** modifying the source code.

For example, how would you accomplish the following with just HTML and CSS?

```js
const date = getDate();
const price = getStockPrice(date, ticker);
const label = document.querySelector("#price");
label.textContent = price;
```

---

*All content is proprietary and confidential.*

Page 11