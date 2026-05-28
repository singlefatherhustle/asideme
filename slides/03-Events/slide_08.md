# Attach the event listener to an element

We usually don't want to listen to *every* click or scroll event that the browser fires. Instead, an event listener is attached to a *specific element*, like a button or a form.

## Diagram: Event Listener Architecture

```
                          click
                            |
                            v
    scroll        hover     click
      |             |         |
      +------+------+---------+
             |
          browser
             |
             v
        event listener
             |
             v
    <button id="countdown">
```

The diagram shows:
- **Browser** (globe icon): Fires multiple events (scroll, hover, click)
- **Event Listener** (headphones icon): Attached to a specific element
- **Element**: `<button id="countdown">` receives the targeted event listener

---

*All content is proprietary and confidential.*

**Page: 7**