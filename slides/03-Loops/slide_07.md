# Common Beginner Misconception

## What is the difference between these two snippets of code?

**The if statement only runs once! The while loop will repeatedly read the next page.**

### Code Comparison

| while loop | if statement |
|---|---|
| `while (!bookFinished){` | `if (!bookFinished){` |
| `    readNextPage();` | `    readNextPage();` |
| `}` | `}` |

```javascript
while (!bookFinished){
    readNextPage();
}
```

```javascript
if (!bookFinished){
    readNextPage();
}
```

---

*All content is proprietary and confidential.*