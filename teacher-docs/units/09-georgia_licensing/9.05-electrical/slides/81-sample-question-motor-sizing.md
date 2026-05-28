# Sample Exam Question — Motor Sizing

## The question

> A 10 HP, 3-phase, 230 V induction motor with service factor 1.15 is to be installed. Determine:
> a) Minimum branch-circuit conductor ampacity
> b) Maximum branch-circuit protection (inverse-time breaker)
> c) Required disconnect rating
> d) Overload setting (using nameplate FLA = 27 A)

## Step-by-step solution

### Step a — Conductor sizing (NEC 430.22)

Use **Table 430.250** for three-phase motor FLA:

```
10 HP, 230 V, 3Ø: FLA = 28 A
```

Conductor ampacity required:

```
28 A × 1.25 = 35 A
```

Conductor selection at 75°C terminations:

```
#10 Cu (75°C): 35 A → matches exactly ✓
#8 Cu (75°C): 50 A → also works (overkill but safer)
```

**Answer a: #10 Cu THHN (or #8 for headroom)**

### Step b — Branch-circuit protection (NEC 430.52, Table)

For inverse-time circuit breaker on a motor of this type:

```
Max % of FLA: 250%
BCP rating: 28 × 2.50 = 70 A
```

Next standard size: 70 A (already standard).

**Answer b: 70 A inverse-time circuit breaker**

If 70 A trips on starting:
- Per exception, may increase to 90 A (next standard up)
- Per exception max, may go to 400% × 28 = 112 A → 125 A breaker (rare)

### Step c — Disconnect rating (NEC 430.110)

```
Disconnect rating ≥ 1.15 × FLA = 1.15 × 28 = 32.2 A
```

Next standard motor-rated disconnect size: 60 A motor-rated.

**Answer c: 60 A motor-rated disconnect**

### Step d — Overload setting (NEC 430.32)

Service factor 1.15 → use 125% of nameplate FLA:

```
27 × 1.25 = 33.75 A
```

**Answer d: Set overload to ~33-34 A (use closest available element)**

If the motor still trips on starting after this setting:
- May increase to 140% of nameplate FLA per 430.32(C)
- 27 × 1.40 = 37.8 A max

## Summary of the four answers

```
Conductor:        #10 Cu THHN (or upsize)
Branch protection: 70 A inverse-time breaker
Disconnect:       60 A motor-rated
Overload:         33-34 A (125% of nameplate)
```

## Common mistakes

- **Using nameplate FLA for sizing**: must use TABLE FLA (28 A) for conductor and BCP
- **Using 125% for BCP**: that's the conductor rule; BCP uses 250% for inverse-time breaker
- **Using 100% for overload**: motors require overload at 115% or 125% of nameplate
- **Disconnect rated for motor FLA**: must be 115% of FLA at minimum
- **Forgetting the next-standard-size rule** when calc lands between sizes

## Real-world pattern

In the field, the same motor commonly gets:

```
- #8 conductor (next size up, easier to terminate, less voltage drop on long runs)
- 70 A breaker (calculation result, no upsize needed)
- 100 A motor-rated disconnect (more common in supply houses than 60 A)
- 35 A solid-state overload (closest commercial setting)
```

These all satisfy the code minimums and are easier to source.
