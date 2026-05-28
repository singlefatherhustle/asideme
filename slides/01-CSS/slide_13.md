# CSS box model

## Definition

The CSS box model is a concept that describes the rectangular boxes generated for elements on a webpage.

## Four Parts of a Box

Each box consists of four parts.

1. **content** = the actual text or media
2. **padding** = space around the content
3. **border** = line surrounding the padding
4. **margin** = space outside the border that separates the element from others

## Visual Diagram

```
┌─────────────────────────────────────────────────────┐
│ margin: 50                                          │
│  ┌──────────────────────────────────────────────┐   │
│  │ border: 5                                    │   │
│  │  ┌─────────────────────────────────────────┐ │   │
│  │  │ padding: 50                             │ │   │
│  │  │  ┌──────────────────────────────────┐   │ │   │
│  │  │  │ 794 × 160                        │   │ │   │
│  │  │  │ (content)                        │   │ │   │
│  │  │  └──────────────────────────────────┘   │ │   │
│  │  │ 50                                      │ │   │
│  │  └─────────────────────────────────────────┘ │   │
│  │ 5                                            │   │
│  └──────────────────────────────────────────────┘   │
│ 50                                                  │
└─────────────────────────────────────────────────────┘
```

The diagram shows layers with:
- Outer layer (dashed border): **margin** (50px on all sides)
- Next layer (solid border): **border** (5px)
- Next layer: **padding** (50px on all sides, with 20px on left/right of content, 30px spacing noted)
- Center layer (blue): **content** (794 × 160)