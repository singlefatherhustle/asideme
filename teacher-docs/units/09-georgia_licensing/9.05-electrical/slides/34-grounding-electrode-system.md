# Grounding Electrode System (NEC 250.50)

## The required electrodes

NEC 250.50 requires that **all** of the following electrodes that are present at a building be bonded together to form the grounding electrode system:

| Electrode | Description |
|---|---|
| **Metal underground water pipe** | ≥ 10 ft of metal pipe in earth; supplemented by an additional electrode |
| **Metal frame of the building** | Effectively grounded structural metal |
| **Concrete-encased electrode (UFER)** | ≥ 20 ft of rebar (1/2" min) in concrete footing, or ≥ 20 ft of #4 copper |
| **Ground ring** | ≥ 20 ft of #2 bare copper buried ≥ 30 in deep |
| **Rod / pipe electrode** | ≥ 8 ft, 5/8" copper-clad steel, ≥ 1/2" diameter |
| **Plate electrode** | ≥ 2 sq ft surface area, ≥ 1/4" thick |
| **Other listed electrodes** | Various proprietary chemical / specialty types |

## Two-rod rule

If using ground rods as the only electrode type, a single rod with resistance ≤ 25 ohms is allowed. If you can't prove < 25 Ω (rare), install a SECOND rod ≥ 6 ft away from the first.

Most installers install two rods by default rather than dragging a megger out for testing.

## UFER (concrete-encased electrode)

Best practice and required in new construction where a footing exists:

- At least 20 ft of #4 or larger rebar already in the footing
- Or 20 ft of #4 bare copper installed in the footing before concrete is poured
- Concrete must be in direct contact with the earth (no vapor barrier)

UFER provides a low-resistance ground because the concrete acts as a giant moisture-retaining electrode.

## Grounding electrode conductor (GEC)

The GEC connects the grounded system conductor to the electrode system. Sizing per **Table 250.66**:

| Service conductor size | Min GEC size (Cu) |
|---|---|
| #2 or smaller | #8 Cu |
| #1 or 1/0 | #6 Cu |
| 2/0 or 3/0 | #4 Cu |
| Over 3/0 to 350 kcmil | #2 Cu |
| Over 350 to 600 kcmil | 1/0 Cu |
| Over 600 to 1100 kcmil | 2/0 Cu |
| Over 1100 kcmil | 3/0 Cu |

## Connection methods

GEC connects to the electrode via:

- Listed lugs (mechanical)
- Exothermic welding (CadWeld)
- Listed clamps for the specific electrode type

The connection must be accessible UNLESS it's buried or encased (then it can be inaccessible if exothermic welded).

## What gets bonded

The grounding electrode system bonds to:

- Service equipment enclosure (neutral-ground bond)
- Equipment grounding conductors (EGCs from feeders/branches)
- Water piping (interior bonding jumper, regardless of whether water pipe is the electrode)
- Gas piping (if metal piping system extends outside)
- Building steel
- Lightning protection (if installed)
