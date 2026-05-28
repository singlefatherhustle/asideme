# Return will immediately stop a function

Any code that comes after a `return` statement *will not* execute.

```js
function yap(){
    console.log("Um, actually...");
    console.log("Did you know that");
    return;
    console.log("this code will never run?");
}
```

---

All content is proprietary and confidential.