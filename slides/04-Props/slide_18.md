# Pass anything through props

Props is an object, so anything you can put into an object, you can also pass through props.

- a boolean
  ```jsx
  <Lamp on={false} />
  ```

- an array of strings
  ```jsx
  <Fridge items={["yogurt", "strawberries", "spinach"]} />
  ```

- a function
  ```jsx
  <Lever task={() => console.log("Switching tracks…")} />
  ```

---

All content is proprietary and confidential.

Page 14