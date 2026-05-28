# Recap

## Avatar Component

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

## Usage Example

```jsx
<Avatar name="Lin Lanying" size={100} />
```

---

*All content is proprietary and confidential.*

**Page 12**