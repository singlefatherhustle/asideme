# Flexbox

A **flex container** automatically rearranges its children, which are called **flex items**, along two axes: the **main axis** and the **cross axis**.

## Diagram: Flex Container Layout

```
┌─────────────────────────────────────────────────────┐
│                  flex container                     │
│                                                     │
│  ┌──────┐                                          │
│  │      │                                          │
│  └──────┘                                          │
│  ┌──────┬──────┬──────┐  ┌──────────────────┐    │
│  │  A   │  B   │  C   │  │   free space     │    │
│  └──────┴──────┴──────┘  └──────────────────┘    │
│       ↑                                            │
│    flex items                                      │
│  ┌──────┐                                          │
│  │      │                                          │
│  └──────┘                                          │
│                                                     │
└─────────────────────────────────────────────────────┘
    ↑                                    ↑
  cross                              main axis
  axis
```

---

All content is proprietary and confidential.