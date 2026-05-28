# Parent-child relationships

You can **nest** elements inside another element.
A **parent** element contains **child** elements.

## Diagram: HTML Element Hierarchy

```
                          html
                         /    \
                       /        \
                    head          body
                   / | \         / | \
                  /  |  \       /  |  \
              title meta meta   h1  p  ul
                              |  / | \ \
                              | /  |  \ \
                              a   li  li  li
```

### Hierarchy Structure:
- **html** (parent)
  - **head** (child of html, parent)
    - title (child of head)
    - meta (child of head)
    - meta (child of head)
  - **body** (child of html, parent)
    - h1 (child of body)
    - p (child of body, parent)
      - a (child of p)
    - ul (child of body, parent)
      - li (child of ul)
      - li (child of ul)
      - li (child of ul)
      - li (child of ul)

---

*All content is proprietary and confidential.*