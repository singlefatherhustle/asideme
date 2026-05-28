# Set a breakpoint

A **breakpoint** is a point in your code where you would like execution of the code to pause. Browsers will activate the debugger upon encountering a breakpoint.

You can set a breakpoint by putting `debugger` anywhere in your code.

```js
let i = 0;
while (i < 3){
    debugger;
    console.log("Counting..." + i);
    i += 1;
}
```

---

All content is proprietary and confidential.

Page 17