# Only descendants can consume context

A component that is *not* a descendant of the provider *cannot* consume values from context.

## Diagram

**Structure:**
- **context** (at top, oval shape) — contains a "value" cylinder
- **Provider** (box) — positioned to the left
  - Arrow labeled "provides" pointing downward
  - Leads to "... many generations ..." (box)
  - Arrow pointing downward to **Consumer** (box)
    - Arrow labeled "consumes" pointing upward to the value from context
- **Unrelated** (box, highlighted in red/pink on the right side)
  - Red X arrow labeled "cannot consume" pointing from value to Unrelated
  - Indicates the unrelated component cannot access context values

## Key Points

- The Provider establishes the context at the top of the component tree
- Any descendant component (Consumer) in the hierarchy can consume context values
- Components that are NOT descendants of the Provider (Unrelated) cannot access context values
- This demonstrates the hierarchical constraint of React Context API

---

*All content is proprietary and confidential.*

**Page:** 10