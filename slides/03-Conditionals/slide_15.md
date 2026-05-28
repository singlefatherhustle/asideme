# Strict vs Loose Equality

You might also encounter these two operators: `==` and `!=`

These operators check for **loose equality**.
They will attempt to convert and compare operands even with different types.
Avoid using loose equality operators.

Instead, use **strict equality** operators: `===` and `!==`

## Comparison Table

| Expression | Result |
|---|---|
| `"0" == 0` | true |
| `"0" === 0` | false |

---

*All content is proprietary and confidential.*