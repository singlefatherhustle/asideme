# External stylesheets

An external stylesheet contains CSS in a separate `.css` file.

*Prefer* external styles because it
- respects separation of concerns
- is the most efficient to maintain.

The same CSS file can be linked to multiple HTML documents.

## style.css

```css
h1 { color: blue; }
```

## index.html

```html
<head>
    <link rel="stylesheet" href="style.css" />
</head>
```

---

All content is proprietary and confidential.