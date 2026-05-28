# Only store hashes

Instead of storing plaintext passwords, we only store the hash.

- Easy to **compare** the hash of a correct password
- If database is leaked, only hashes are revealed, not passwords
- Difficult to get the user's actual password with just the hash

## Flow Diagram

```
client --p@ssw0rd--> API --p@ssw0rd--> hash --ko5dn--> Database
```

**Components:**
- **client**: Computer/user device
- **API**: Server application
- **hash**: Hashing function/processor (represented by robot icon)
- **Database**: Data storage (cylinder icon)

**Data flow:**
1. Client sends plaintext password `p@ssw0rd` to API
2. API sends plaintext password `p@ssw0rd` to hash function
3. Hash function generates hash output `ko5dn`
4. Hash value `ko5dn` is stored in Database

---

*All content is proprietary and confidential.*

Page: 8