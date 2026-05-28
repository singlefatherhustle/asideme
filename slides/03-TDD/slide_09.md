# npm

We use **npm** to access the **npm registry**, which is a public collection of **packages** of open-source code. These files are saved in a **node_modules** folder and are referred to as **dependencies** because our project now *depends* on this external code.

## Diagram: npm Registry and Dependencies Flow

**Structure:**
- **Left side - npm registry**: Contains multiple JS package boxes, with the npm logo
- **Center - npm**: Central npm logo serving as the access point
- **Right side - node_modules**: Yellow folder containing the downloaded packages (multiple JS boxes)

**Relationships:**
- Arrow from npm registry packages → npm (access/query)
- Arrow from npm → node_modules folder (installation/download)

---

*All content is proprietary and confidential.*

Page 9