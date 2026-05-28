# Props is an object

You might have noticed the **dot notation** in the previous slide. That's right — **props is an object!** We can unpack its properties with object destructuring syntax.

## Code Example

```jsx
function Avatar({name, size}){
  return (
    <img
      src={getImageUrl(name)}
      width={size}
      height={size}
      alt={name}
    />
  );
}
```

## Benefits

- More explicit about the input this component wants
- Removes repetitive dot notation

---

*All content is proprietary and confidential.*

**Page: 9**