# Heat Pumps

## What a heat pump is

A refrigeration system that can run in two directions:

- **Summer (cooling mode)**: removes heat from inside, dumps it outside
- **Winter (heating mode)**: pulls heat from outside, dumps it inside

The same equipment heats and cools by reversing the refrigeration cycle with a reversing valve.

## How it works

```
COOLING MODE:
   Refrigerant absorbs heat indoors (evaporator),
   releases it outdoors (condenser).

HEATING MODE (reversed):
   Refrigerant absorbs heat outdoors (now evaporator),
   releases it indoors (now condenser).
```

The reversing valve switches which coil is which when you switch modes.

## Types of heat pumps

| Type | Description |
|---|---|
| **Air-source (ASHP)** | Most common; uses outdoor air as the heat source/sink |
| **Geothermal (GSHP)** | Uses ground or water loop; higher efficiency, expensive install |
| **Ductless mini-split** | Air-source; small individual zones; no ducts |
| **Water-source** | Uses building water loop (common in commercial) |
| **Hybrid** | Combines heat pump with gas furnace (auxiliary heat) |

## Efficiency in cold weather

A heat pump's heating capacity decreases as outdoor temp drops:

```
Outdoor 47°F: 100% rated capacity
Outdoor 30°F: ~75% capacity
Outdoor 17°F: ~50% capacity
Outdoor 5°F:  ~25% capacity (typical)
```

Below 30°F, supplemental heat (electric resistance or gas) kicks in.

## Auxiliary heat

When heat pump alone can't keep up:

- **Electric resistance** (strip heat): typically 5-15 kW elements
- **Gas furnace** (in dual-fuel): more efficient at low temps
- **Geothermal**: doesn't lose efficiency at low temps

## Heat pump COP

Coefficient of Performance = heating output / energy input

```
At 47°F: COP ~3.5 (3.5 units of heat per 1 unit of electricity)
At 30°F: COP ~2.5
At 17°F: COP ~2.0
At 5°F:  COP ~1.5 (still better than electric resistance, COP 1.0)
```

Electric resistance is always COP 1.0 (1 BTU per BTU input). Heat pump beats it down to about 5°F.

## Climate consideration

Georgia winters:

- **South Georgia**: Heat pump usually sufficient year-round
- **Middle Georgia**: Heat pump + 5-10 kW strip heat works well
- **North Georgia (mountains)**: Consider dual-fuel for efficiency

## Defrost mode

When the outdoor coil ices up in cold weather:

- Heat pump reverses temporarily into cooling mode
- Hot refrigerant melts the ice on the outdoor coil
- Auxiliary heat keeps the building warm during defrost
- Cycle: typically every 30-90 minutes in cold weather

Defrost is normal — not a malfunction. But improper defrost (icing again immediately) indicates problems.

## Sizing considerations

For heat pumps, size to the cooling load:

```
Cooling load (Manual J): 36,000 BTU/hr
Heat pump cooling capacity: 36,000 BTU/hr (3 ton)
Heat pump heating capacity at 47°F: ~36,000 BTU/hr
Heating load (Manual J): 42,000 BTU/hr at 17°F
Strip heat needed: 42,000 - 18,000 = 24,000 BTU/hr ≈ 7 kW
```

Configure strip heat to cover the gap between heat pump capacity at coldest conditions and the heating load.

## Common heat pump errors

- Sizing to heating load (oversizes the cooling)
- Forgetting auxiliary heat
- Not specifying strip heat capacity correctly
- Customer comfort complaints about cool air from heat pump (it's 90°F not 120°F like gas)
- Pushing heat pump where gas furnace is more economical
