# Listen for an event

How do we make something happen when an event fires? We need an **event listener**, which will stay idle until it *hears* the event that it is waiting for.

## Diagram: Event Listener Flow

```
                    click
                      |
                      ↓
scroll → browser ← hover ← click → event listener
```

**Components:**
- **browser** (blue globe icon) - receives events: scroll, hover, click
- **event listener** (green circle with headphones icon) - listens and responds to click events

The diagram shows:
- The browser receives multiple events (scroll, hover, click)
- An arrow points from a "click" event at the top to the event listener on the right
- The event listener waits idle until it hears the specific event it's listening for

---

*All content is proprietary and confidential.*

Page 6