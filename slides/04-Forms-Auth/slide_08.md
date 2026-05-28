# Pass in FormData

When the form is submitted, React will pass `FormData` as the argument to the action. Otherwise, the logic is identical to the submit handlers that we've previously worked with.

## Code Example

```javascript
function addListing(formData){
    const title = formData.get("title");
    const description = formData.get("description");
    …
}
```

## Form Implementation

```html
<form action={addListing}>
```

---

All content is proprietary and confidential.