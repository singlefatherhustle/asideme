# Select other elements

We don't always want to interact with the *entire* document. Instead, we can **select** specific elements in the document with a CSS selector.

```js
const plate = document.querySelector(".plate");
```
This will select the first element in the document with class `plate`.

```js
const plates = document.querySelectorAll(".plate");
```
This will select *all* elements in the document with class `plate`.

---

All content is proprietary and confidential.