# Internal stylesheets

Internal stylesheets are contained within `<style>` elements, which go inside the HTML `<head>`.

*Avoid* using internal styles if possible!

- least efficient implementation of CSS for maintenance
- breaks separation of concerns between presentation (CSS) and content (HTML)

## Code Example

```html
<head>
    <style>
        h1 { color: blue; }
    </style>
</head>
```

---

*All content is proprietary and confidential.*