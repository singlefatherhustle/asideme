# JSON

Because websites communicate with each other via HTTP, which stands for Hyper Text Transfer Protocol, we want to be able to turn objects into text and vice versa.

JSON (JavaScript Object Notation) is the text representation of an object.

## JSON.stringify

`JSON.stringify` turns an object into a string.

```js
const weatherAsText = JSON.stringify(weather);
```

## JSON.parse

`JSON.parse` turns a JSON string back into an object.

```js
const weatherAsObject = JSON.parse(weatherAsText);
```

---

*All content is proprietary and confidential.*

**Page: 12**