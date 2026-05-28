# Look familiar?

We've seen similar logic before in **event handlers**. In fact, an event handler is also a tool to help us contain and manage side effects in React!

## Diagram: Event Flow

```
Browser Events:
- scroll
- hover
- click

         ↓
    
Event Listener (green circle)
    ↓
Event Handler (robot icon)
    ↓
API (cloud icon)

HTML Element:
<Button id="countdown" />
```

### Components:

- **browser**: Globe icon showing scroll, hover, and click events
- **event listener**: Green circle that captures events and calls the event handler
- **event handler**: Robot icon that processes the event
- **API**: Cloud icon representing external API calls
- **Button**: HTML element with id="countdown"

---

*All content is proprietary and confidential.*

**Page: 10**