# Review

Let's take a look at the auth flow again. Last time, we wrote the code from the **client's** perspective. Today, we're going to focus on the **server's** perspective.

## Authentication Flow Diagram

### Step 1: Initial Login Request
```
Client --[POST /login credentials]--> API
```

### Step 2: Token Response
```
API --[200 OK]--> Client
API --[token]--> Client
API --[checks]--> database
```

### Step 3: Authenticated Requests with Token

**Successful Access:**
```
Client --[token]--> /rooms/5
Client --[token]--> /pools/1
```

**Access Granted:**
```
Client --[token]--> /rooms/18
```

**Access Denied:**
```
Client --[token]--> /staff (marked with X)
```

---

*All content is proprietary and confidential.*

**Page 4**