# Arrays and Objects are Also Read-Only

That includes arrays and objects!

## Code Examples

```javascript
const [numbers, setNumbers] = useState([3,4,5,6]);
numbers[0] = 2;                    // BAD
setNumbers([2,4,5,6]);             // GOOD
```

```javascript
const [pet, setPet] = useState({name: "Sparky"});
pet.name = "Pyro";                 // BAD
setPet({name: "Pyro"});            // GOOD
```

---

*All content is proprietary and confidential.*