# useEffect listens for changes in state

React monitors changes in state. `useEffect` hooks into this behavior and listens for changes in *specific* pieces of state. Whenever a **dependency** changes, `useEffect` will invoke the **Effect** function (also called **setup**), which does not have to be pure.

## Diagram: useEffect Flow

```
React Component
├── State variables
│   ├── bar
│   ├── wobble
│   └── foo
│
useEffect
├── Listens for dependency changes
└── Calls → Effect (setup function)
    └── Communicates → API
```

**Visual Flow:**
- **React** (left): Contains state variables `bar`, `wobble`, and `foo`
- **useEffect** (center, green circle with headphones icon): Monitors changes to `foo` dependency
- **Effect** (right, robot icon): Executes when dependency changes
- **API** (top right, cloud): Effect communicates with external API

**Key Relationships:**
- `foo` state variable (blue box, top left) → triggers `useEffect` when it changes
- `useEffect` calls the Effect function
- Effect function makes API calls to external API service

---

*All content is proprietary and confidential.*

Page 9