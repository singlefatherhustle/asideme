# AuthContext

As we've discussed previously, context can also be used to hold logic involving authentication and authorization.

## Diagram: AuthContext Architecture

```
                                    AuthContext
                                         |
                    _____________________|_____________________
                   |                     |                     |
                 login                register               token
                 (robot)               (robot)               (key icon)
                   |                     |                     |
                   |_____________________|_____________________|
                                         |
                                   logout (robot)
                                         |
                    _____________________|_____________________
                   |                                           |
              Auth Provider                                  App
                   |                                           |
                   |___________________________________________|
```

The diagram shows:
- **AuthContext** at the top containing authentication-related functions and data
- **Auth Provider** component below AuthContext
- **App** component receiving context from AuthProvider via arrow
- **AuthContext contents:**
  - login (user icon)
  - register (user icon)
  - token (key icon)
  - logout (user icon)

---

*All content is proprietary and confidential.*

Page 7