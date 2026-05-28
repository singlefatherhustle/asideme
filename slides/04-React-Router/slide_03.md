# Review

## Question

What is the purpose of `page` and `setPage` in PageContext?

## Diagram: PageContext Architecture

```
                          PageContext
                         /           \
                    page            setPage
                   (database)       (robot icon)
                        |                |
                        |                |
                   PageProvider          |
                        |                |
                        |________________|
                             |
                             | ...
                             ↓
                            App
```

### Component Descriptions

- **PageContext**: Contains `page` and `setPage`
  - `page`: Database/storage element
  - `setPage`: Robot/action element
- **PageProvider**: Wraps the context
- **App**: Consumer component that receives PageContext

---

*All content is proprietary and confidential.*