# Context is not always better

It might be tempting to replace prop drilling completely with context, but it's not always better. Context has a cost.

1. Whenever the context value changes, *every* component that consumes the context is rerendered. This can be expensive!
2. The flow of data is a lot more *opaque* because it's no longer obvious which components are accessing the same context. This can be a headache to maintain!

---

All content is proprietary and confidential.

Page 11