# Receive input through props

Imagine an **Avatar** component which will display a person's profile image at a certain size. This component needs a **name** and **size** as input, so it'll get that information through **props**.

```jsx
function Avatar(props) {
  return (
    <img
      src={getImageUrl(props.name)}
      width={props.size}
      height={props.size}
      alt={props.name}
    />
  );
}
```

---

All content is proprietary and confidential.