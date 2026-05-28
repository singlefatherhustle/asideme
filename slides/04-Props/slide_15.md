# JSX syntax for passing props

## Component Function Definition

```javascript
function Avatar({name, size}){...}
```

## Incorrect Usage (Function Call)

```javascript
Avatar({name: "Lin Lanying", size: 100});
```

Wait! That's not how you usually call a component function in React.

## Correct Usage (JSX Syntax)

So how do you **actually** pass props into a component function? With some special JSX syntax which resembles HTML attributes.

```jsx
<Avatar name="Lin Lanying" size={100} />
```

---

**Page:** 11

**Footer:** All content is proprietary and confidential.