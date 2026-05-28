# Review

## In what scenarios would you want to use context?

Context is a useful tool when you have data that will be shared across many components in the application, especially if those components are far away.

## Diagram: Context Data Distribution

```
┌─────────────────────────────────────────────────────┐
│         Context Provider (top level)                │
│              [orange circle icon]                   │
└─────────────────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │Component │   │Component │   │Component │
    │(orange)  │   │(orange)  │   │(orange)  │
    └──────────┘   └──────────┘   └──────────┘
          │              │              │
          └──────────────┼──────────────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐
    │Component │   │Component │
    │(orange)  │   │(orange)  │
    └──────────┘   └──────────┘
```

---

**Footer:** All content is proprietary and confidential.

**Page Number:** 4