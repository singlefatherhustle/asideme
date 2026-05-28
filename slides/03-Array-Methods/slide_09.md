# Return a function

Functions that return a function are also considered to be higher-order.

```js
function speak(word) {
  // Arrow functions without curly braces are single-line returns.
  return () => console.log(word);
}

// speak() returns a function value that we assign to baz
const baz = speak("baz");
const wobble = speak("wobble");

baz(); // will log "baz"
wobble(); // will log "wobble"
```

---

All content is proprietary and confidential.

9