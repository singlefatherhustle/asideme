# Real-Life Scenario — Commercial New Installation

## The setup

You bid a 6,000 sq ft retail buildout in a strip center. Existing condition: a vacant shell with 200A 480Y/277V service. Tenant wants:
- General retail lighting at 3 VA/ft²
- Receptacles per code (~50 standard locations)
- Display case lighting (continuous)
- Two HVAC rooftop units (existing — you connect)
- Computer counter / POS area
- Security cameras and access control panel
- Sign electrical service

This is **Class II contractor work** — three-phase service exceeds the 200A scope cap of Class I and the voltage is 480V (not single-phase).

## Load calculation

### Step 1 — Lighting load

```
6,000 ft² × 3 VA/ft² = 18,000 VA general lighting
Apply continuous-load multiplier: × 1.25 = 22,500 VA  ← continuous
```

### Step 2 — Receptacle load (220.44)

```
50 receptacles × 180 VA = 9,000 VA
   First 10,000 @ 100% = 9,000 VA (have only 9,000)
                          9,000 VA
```

### Step 3 — Display case lighting (continuous)

```
Estimated 4,800 VA × 1.25 = 6,000 VA continuous
```

### Step 4 — HVAC

```
2 rooftop units, 5 ton each, 24,000 BTU/hr ≈ 4,800 VA each running
2 × 4,800 = 9,600 VA running

Plus motor starting consideration:
For largest motor: 4,800 × 1.25 = 6,000 VA
Other motor: 4,800 VA
Total HVAC: 10,800 VA
```

### Step 5 — POS / Computer counter

```
1 dedicated 20A circuit: 1,500 VA
```

### Step 6 — Security / access control

```
2 dedicated 20A circuits: 1,500 VA each = 3,000 VA
```

### Step 7 — Sign

```
1,200 VA minimum per 220.43 sign requirement
```

### Step 8 — Total

```
Lighting:                22,500 VA
Receptacles:              9,000 VA
Display lighting:         6,000 VA
HVAC:                    10,800 VA
POS / counter:            1,500 VA
Security / access:        3,000 VA
Sign:                     1,200 VA
                       ─────────
Total demand:            54,000 VA

Service ampacity at 480Y/277V three-phase:
   A = 54,000 / (480 × √3) = 54,000 / 831 ≈ 65 A
```

A 100A 3Ø panel handles this comfortably, but the existing 200A service has plenty of headroom.

## Distribution design

```
200A Main breaker (existing)
   │
   ├── Panel A: 200A bus, lighting + receptacles (3-phase)
   │   ├── 20A × 12 circuits: lighting (LED)
   │   ├── 20A × 8 circuits: receptacles
   │   └── 20A × 4 circuits: display lighting + signage
   │
   ├── 30A breaker → Subpanel B
   │      └── Panel B: 60A bus, HVAC dedicated
   │          ├── 30A 2P × 2 circuits: rooftop units
   │
   └── 20A breaker × 2: dedicated POS + security
```

## Code highlights

- **Lighting** is treated as continuous → 125% multiplier
- **Receptacles** in retail get 180 VA × count, then 50% over first 10 kVA
- **Sign load** is a fixed minimum (1,200 VA) regardless of actual sign size
- **HVAC** sized per motor rules (Article 430), with largest-motor adder

## Inspector pulls

The inspector will check:

- Working space around panels (Article 110.26 — 3.5 ft min at 277/480)
- Arc flash warning labels on all switchgear ≥ 50V
- GFCI in bathroom, near sinks, outdoor receptacles
- LED driver compatibility with circuit (some require neutral)
- Dedicated circuit for refrigeration / display case condensers
- Disconnect within sight for each rooftop unit

## Class II-specific signals

The 480V service makes this Class II contractor work. The contractor also needs:

- Familiarity with 277V lighting (most commercial fluorescent/LED at this voltage)
- Three-phase motor controllers
- Higher-voltage PPE (rubber gloves rated for ≥ 1000V)
- Knowledge of POE (power over Ethernet) for security cameras
