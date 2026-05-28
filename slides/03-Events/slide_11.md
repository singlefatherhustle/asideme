# Code example

## What does the code snippet below do?

When the user clicks the button, count will go down by 1.
In other words, it modifies state as a reaction to user interaction.

## Code

```javascript
let count = 10;

function countdown(){
    console.log(count);
    count -= 1;
}

const countdownButton = document.querySelector("button#countdown");
countdownButton.addEventListener("click", countdown);
```

---

All content is proprietary and confidential.