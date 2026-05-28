# Sample Question — Equipment Sizing

## The question

> A 2,400 sq ft home in Atlanta requires HVAC equipment. The Manual J load calculation indicates:
> - Total cooling load: 28,500 BTU/hr
> - Sensible cooling load: 22,000 BTU/hr
> - Latent cooling load: 6,500 BTU/hr
>
> Total external static pressure available at design CFM: 0.5 in W.C.
> Design CFM: 1,000 CFM
>
> What size AC and indoor coil should be selected?

**Answer choices:**

```
A) 2-ton AC + 2-ton indoor coil
B) 2.5-ton AC + 3-ton indoor coil
C) 2.5-ton AC + 2.5-ton indoor coil (matched)
D) 3-ton AC + 3-ton indoor coil
```

## Step-by-step solution

### Step 1 — Match load to nominal capacity

```
Cooling load: 28,500 BTU/hr
Available sizes (BTU/hr):
   1.5 ton = 18,000
   2.0 ton = 24,000   ← Too small (24,000 < 28,500)
   2.5 ton = 30,000   ← Closest oversize
   3.0 ton = 36,000   ← Oversized by 25%
   3.5 ton = 42,000   ← Way too big
```

Choose 2.5 ton (30,000 BTU/hr).

### Step 2 — Verify capacity at design conditions

Look up 2.5-ton condenser performance:

```
At 95°F outdoor, 80°F return: 28,200 BTU/hr total
   Sensible: 21,500 BTU/hr
   Latent:   6,700 BTU/hr
```

Compare to load:
- Total need: 28,500 BTU/hr → Available 28,200 → just under, acceptable
- Sensible need: 22,000 → Available 21,500 → under by 500 BTU
- Latent need: 6,500 → Available 6,700 → adequate

The 2.5 ton is slightly small on sensible but well-matched overall.

### Step 3 — Match indoor coil

The indoor coil must be AHRI-certified with the outdoor condenser:

```
2.5-ton matched coil: rated 30,000 BTU/hr total
   - Coil airflow at 0.5 in W.C. ESP: 1,000 CFM (typical)
   - Sensible Heat Ratio: 0.71 (typical for matched system)
```

Match it to the 2.5-ton condenser (same brand, AHRI certified).

### Step 4 — Verify airflow

Design CFM: 1,000
Equipment's nominal CFM at design ESP: 1,000

✓ Match.

### Step 5 — Conclusion

**Answer: C) 2.5-ton AC + 2.5-ton indoor coil (matched)**

## Why each wrong answer is wrong

**A) 2-ton AC + 2-ton coil**: Capacity 24,000 BTU/hr falls short of 28,500 load. Unit runs continuously on hot days and never reaches set point.

**B) 2.5-ton AC + 3-ton indoor coil**: Mismatched. Larger indoor coil with smaller condenser is rare and:
- Not AHRI certified (no published performance data)
- Refrigerant flow rate doesn't match coil capacity
- Voids warranty
- May "work" but with unpredictable performance

**D) 3-ton AC + 3-ton coil**: Oversized by ~25%. Will short-cycle, not dehumidify well, and waste energy.

## Key takeaways

For exam:

```
1. Match load to nominal capacity (next standard size up)
2. Verify capacity at design conditions (not nominal)
3. Match indoor coil to outdoor condenser (AHRI certified pair)
4. Verify airflow capability at design ESP
```

For real installations:

```
- Don't oversize "to be safe"
- Don't mix brands or coils
- Don't size to building area alone
- Always do Manual J, S, and D properly
```
