# Sample Question — DFU Calculation and Pipe Sizing

## The question

> A new residential bathroom contains the following fixtures, all draining into a single horizontal branch line:
> - Water closet (toilet)
> - Lavatory (bathroom sink)
> - Bathtub
> - Shower stall
>
> Using a slope of 1/4 inch per foot, what is the minimum size required for the horizontal branch line draining all four fixtures?

**Answer choices:**

```
A) 1-1/2 inch
B) 2 inch
C) 3 inch
D) 4 inch
```

## Step-by-step solution

### Step 1 — Sum the Drainage Fixture Units (DFU)

From IPC Table 709.1:

```
Water closet: 4 DFU
Lavatory:     1 DFU
Bathtub:      2 DFU
Shower:       2 DFU
                ──
Total:         9 DFU
```

### Step 2 — Look up pipe size

For horizontal branch at 1/4 in/ft slope (most residential):

| Pipe size | Max DFU |
|---|---|
| 1-1/2 inch | 3 DFU |
| 2 inch | 6 DFU |
| 2-1/2 inch | 12 DFU |
| 3 inch | 30 DFU (but 6 max for water closet) |
| 4 inch | 180 DFU |

For 9 DFU we need at least 2-1/2 inch capacity.

### Step 3 — Apply water closet constraint

The IPC requires a minimum 3-inch drainage pipe to serve a water closet:

```
"Water closets shall not drain into pipes smaller than 3 inches."
```

This is the binding constraint here. Even though 2-1/2 inch would handle 9 DFU based on capacity alone, the 3-inch minimum for water closet forces us up.

**Answer: C) 3 inch**

## Why each wrong answer is wrong

**A) 1-1/2 inch**: Cannot carry 9 DFU; also too small for water closet.

**B) 2 inch**: Cannot carry 9 DFU; also too small for water closet.

**D) 4 inch**: Code-acceptable but oversized. The question asks for *minimum*.

## Key takeaways

```
1. Always sum DFU from the most demanding pipe segment
2. Look up the required size in the appropriate code table
3. Apply special constraints (water closet 3-inch minimum)
4. Don't oversize unless required by another constraint
```

## Variations on this question

A common variant adds a kitchen sink:

```
Water closet: 4 DFU
Lavatory:     1 DFU
Bathtub:      2 DFU
Shower:       2 DFU
Kitchen sink: 2 DFU
                ──
Total:        11 DFU
```

Still 3-inch minimum (water closet binds the size choice). The 11 DFU is well within 3-inch capacity (30 DFU).

Another variant: building drain with many fixtures:

```
3 bathrooms (9 DFU each):  27 DFU
2 kitchen sinks (2 each):    4 DFU
Laundry/dish:                4 DFU
                              ──
Total:                       35 DFU
```

For building drain at 1/4 in/ft, this exceeds 3-inch (30 DFU max). Up-size to 4-inch (180 DFU).

## Common DFU errors

- Using the supply table instead of drainage table
- Forgetting the water closet minimum size constraint
- Miscounting DFU (e.g., counting a bath group as 1 DFU instead of summing the fixtures)
- Using slope-1/8 vs slope-1/4 mismatched with the table
- Adding DFU from multiple separate drainage paths (only count what's in the pipe being sized)
