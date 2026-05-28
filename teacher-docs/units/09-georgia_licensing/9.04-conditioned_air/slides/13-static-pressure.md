# Static Pressure

## What it is

The resistance that air encounters as it moves through the duct system, filter, coil, and registers. Measured in inches of water column (in W.C.).

Higher static pressure = harder for the blower to push air through the system.

## External Static Pressure (ESP)

Total resistance the blower must overcome:

```
ESP = Supply duct resistance + Return duct resistance + Filter + Coil + Registers
```

Typical residential systems are designed for **0.5 in W.C.** at the blower's design CFM.

## Total Static Pressure (TSP)

Measured across the entire system, including the equipment internal resistance:

```
TSP = External Static + Internal Equipment Static
```

Measuring TSP at the blower output:

- Insert manometer at supply trunk
- Insert manometer at return drop (close to air handler)
- Difference = TSP

## What high static pressure means

```
Design TSP: 0.5 in W.C.
Measured TSP: 0.9 in W.C. — TOO HIGH

Causes:
   - Dirty filter (very common)
   - Crushed return drop
   - Undersized ductwork
   - Closed dampers
   - Restricted indoor coil
   - Sharp duct fittings
```

High static = motor strain, low airflow, premature equipment failure.

## What low static pressure means

```
Measured TSP: 0.2 in W.C. — TOO LOW

Causes:
   - Massive duct leakage (air bypassing the design path)
   - Disconnected return duct
   - Filter slot left open
   - Wrong blower speed setting (motor too slow)
```

Low static can be just as problematic — usually indicates major air leakage.

## Measurement procedure

```
1. Insert hose into supply plenum (1-2 ft downstream of blower)
2. Insert hose into return drop (close to filter)
3. Connect to manometer (digital or U-tube)
4. Read difference in inches of W.C.
5. Compare to manufacturer specification
```

## Friction rate calculation

```
Available static / Total equivalent length × 100 = Friction rate (in W.C./100 ft)

Example:
   0.5 in W.C. available / 250 ft TEL × 100 = 0.20 in W.C./100 ft
```

This friction rate is used in Manual D duct sizing tables.

## Effect on airflow

```
Static pressure   ↑  → Airflow   ↓
Static pressure   ↓  → Airflow   ↑
```

Most residential blowers are constant-speed. Higher static = less airflow at the blower's fixed speed.

ECM (Electronically Commutated Motor) blowers compensate for static by varying speed — they maintain set CFM regardless of static (within limits).

## What inspectors check

For commissioning new installations:

```
1. Verify TSP within manufacturer's specification range
2. Check airflow with anemometer or hood
3. Compare actual to design CFM
4. Document on commissioning report
```

Acceptable range: typically ± 10% of design CFM.

## Troubleshooting checklist for high TSP

```
☐ Replace dirty filter
☐ Check that return air grilles are unblocked
☐ Verify all dampers are open (zoning systems)
☐ Inspect indoor coil for dirt buildup
☐ Check duct runs for crushed or kinked sections
☐ Verify duct sizes match Manual D
☐ Check blower speed setting (jumper or DIP switch)
```

## Common static pressure errors

- Skipping the measurement during commissioning
- Replacing filters but not testing static after
- Assuming a clean filter is the problem when ducts are oversized
- Not measuring both supply and return separately
- Confusing static with velocity pressure (different measurements)
