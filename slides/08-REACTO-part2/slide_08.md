# C = Code your solution

~5 minutes

At this point, you should have comprehensive pseudocode that you've tested against your provided examples. It should be quick to translate your pseudocode into code.

```javascript
function countInCommon(arrayA, arrayB) {
    let counter = 0;
    for (const a of arrayA) {
        for (const b of arrayB) {
            if (a === b) counter += 1;
        }
    }
    return counter;
}
```

---

All content is proprietary and confidential.