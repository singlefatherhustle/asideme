# Issues with prop drilling

Imagine you had to drill props through 20 generations of components. What issues do you think might come up?

- Verbose
- Repetitive
- Tedious to write
- Typos
- Merge conflicts

## Component Hierarchy Diagram

A tree structure showing component nesting across multiple levels:

```
                    [Root Component]
                            |
                ____________|____________
               |                        |
        [Container]            [Container]
           |    |                  |    |
        [Comp][Comp]        [Comp][Comp]
                                   |
                              [Component]
                               |      |
                           [Folder][Folder]
```

The diagram illustrates a deep component hierarchy where props would need to be passed down through multiple intermediate components (shown in various shades of blue and outlined boxes) to reach leaf components at the bottom.

---

All content is proprietary and confidential.

**Page: 5**