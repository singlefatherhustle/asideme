# You can nest providers

A React project might have many different contexts, each encapsulating a different portion of the app. A Provider can be a parent of another Provider!

The order doesn't matter as *long as the contexts are independent* of each other.

If ContextA uses a value from ContextB, then ProviderB must be an ancestor of ProviderA.

## Provider Hierarchy Diagram

```
PageProvider ──→ PageContext
    ↓
AuthProvider ──→ AuthContext
    ↓
ThemeProvider ──→ ThemeContext
    ↓
    ...
```

---

*All content is proprietary and confidential.*

**Page 9**