# Real-Life Scenario — Residential Service Upgrade

## The setup

You bid a 100A → 200A service upgrade on a 1970s ranch home. The customer wants to add an EV charger and central AC, both of which the existing service can't handle.

Existing:
- 100A overhead service drop
- Federal Pacific panel (known fire hazard)
- 1 ground rod, no UFER
- Knob-and-tube wiring in some original circuits
- Old aluminum branch circuits in one addition

## The plan

### Service-entrance conductor sizing

200A service per NEC: requires 2/0 Cu or 4/0 Al for the SE conductors.

```
2/0 Cu SE: 175 A @ 75°C → boost to 200 A by 310.12 dwelling rule
```

Per **NEC 310.12** (the "dwelling service rule"), residential service conductors may be sized at a slightly reduced ampacity than the standard table allows, **specifically for the main service to one dwelling**:

- 200 A service: 2/0 Cu or 4/0 Al (both allowed)

### Panel selection

Replace Federal Pacific with:
- 200 A main breaker panel
- 30-40 circuit positions (room to grow)
- Made by reputable manufacturer (Square D, Eaton, Siemens)

### Grounding electrode system

NEC 250.50 requires bonding all available electrodes. For this home:

```
1. Existing ground rod — keep
2. Add a SECOND ground rod (≥ 6 ft from first) — required since UFER not present
3. Bond to interior water pipe (within 5 ft of entry into building)
4. GEC sizing:
   - To rods: #6 Cu (cap per 250.66(A))
   - To water pipe: #4 Cu (per Table 250.66 for 2/0 SE)
```

### Knob-and-tube circuits

Old knob-and-tube wiring:
- Not GFCI/AFCI protected
- Generally still legal if not modified (NEC doesn't require existing K&T removal)
- BUT if you modify any circuit, the modified portion must comply with current NEC

Plan: replace any circuits that need modification; document existing K&T as-is.

### Aluminum branch circuits

Old aluminum branch wiring:
- Requires CO/ALR rated devices (receptacles, switches) at all terminations
- Anti-oxidant compound on connections
- Or replace with copper

Plan: identify all aluminum branches, install CO/ALR devices throughout.

### EV charger circuit

40A or 50A 240V circuit dedicated to EV charger:

```
50A circuit (most common modern installs):
   #6 Cu THHN
   50A 2-pole breaker
   Disconnect within sight (or breaker can serve)
```

### Permit and inspection

Required for service work in Georgia:

1. Permit pulled from local AHJ
2. Coordination with the utility (Georgia Power) for cutover
3. Final inspection before utility re-energizes service
4. Updated electrical permit posted on-site

## The execution

```
1. Schedule utility cutover date
2. Disconnect: utility opens service drop
3. Remove old service, install new mast, drip loop, weatherhead
4. Install new 200A panel + main breaker
5. Drive second ground rod, bond water pipe
6. Reconnect existing branches (with current-code adjustments)
7. Wire EV charger circuit
8. Call for inspection
9. After inspection passes, utility reconnects
10. Test all circuits live, document
```

## Risk and signals

- **Knob-and-tube discovery**: legal as-is but flammable. Customer should be warned even if scope doesn't include rewire.
- **Aluminum branches**: a known hazard. Quote for CO/ALR upgrade at minimum.
- **Permit pulled**: never skip. Insurance won't cover unpermitted work.
- **Federal Pacific replacement**: known defective. Always recommend full replacement, never reuse the bus.

This scenario is common Class I residential work — fits scope exactly. A Class II contractor could also do it; the work doesn't require their broader scope.
