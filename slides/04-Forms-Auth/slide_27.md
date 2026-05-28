# Manage auth in context

Many different components might want to know if the user is logged in or not. Rather than repeating this auth logic in every component, we can keep it all in one place with context.

## Architecture Diagram

```
AuthContext
├── login (robot icon)
├── register (robot icon)
├── token (key icon)
└── logout (robot icon)
    │
    ├── Auth Provider
    │   │
    │   └── ... (ellipsis arrow)
    │       │
    │       └── App
    │           │
    │           └── (bidirectional arrow back to AuthContext)
```

### Component Structure

- **AuthContext**: Central context containing:
  - login (authentication action)
  - register (registration action)
  - token (authentication token)
  - logout (logout action)

- **Auth Provider**: Wraps the application and provides AuthContext

- **App**: Main application component that consumes AuthContext

---

**Page number**: 23

**Footer note**: All content is proprietary and confidential.