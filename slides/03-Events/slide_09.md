# Invoke the event handler

Once the event **listener** hears the event being fired, it will call the **event handler** function. In other words, an **event handler** is a function that is triggered when an event occurs.

## Diagram: Event Flow

```
                          click
                            |
                            ↓
        click      hover    click
         |           |        |
      scroll ————————●————————●
         |
        
    [browser globe icon]
         |
    (labeled: browser)
         |
       scroll, hover, click events
         |
         ↓
    [green circular icon with headphones]
    (labeled: event listener)
         |
       calls
         |
         ↓
    [robot icon]
    (labeled: event handler)
         
         |
         ↓
    <<button id="countdown">>
    (labeled as target element)
```

### Component Flow:
- **Browser**: Detects events (click, scroll, hover)
- **Event Listener**: Listens for specified events on the element `<button id="countdown">`
- **Event Handler**: Function that executes when the event listener detects the event
- **Target Element**: `<button id="countdown">`

---

*All content is proprietary and confidential.*

Page 8