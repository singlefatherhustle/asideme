# Not every resource

The token does not grant access to *every* resource!

## Diagram: Token Access Limitations

```
Client → token → /rooms/18 ✗
         (wrench icon)

Client → token → /staff ✗
         (wrench icon)
```

**Description:** 
- Two identical flowcharts showing a client with a token attempting to access different resources
- Each attempt is marked with a red X symbol, indicating denied access
- Top example: token cannot access `/rooms/18` resource
- Bottom example: token cannot access `/staff` resource
- The token is represented by a wrench/key icon in gray
- Red X marks indicate failed authorization

---

*All content is proprietary and confidential.*

**Page: 18**