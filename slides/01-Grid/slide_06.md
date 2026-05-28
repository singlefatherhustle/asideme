# Font-related relative units

Remember what the T in HTML stands for? That's right, *text*! That's why we *prefer* font-related relative units, since they scale the content according to the size of the text on the page.

## ch

**ch** = width of a single character

```css
width: 60ch; /* = set width to fit 60 characters */
```

## em

**em** = font-size of the *closest* element

```css
height: 1.5em; /* = if font-size is 12pt, then this will set height to 18pt */
```

## rem

**rem** = font-size of the *root* element

## lh

**lh** = height of an empty line

```css
height: 21h; /* = set the height to fit 2 lines of text */
```

---

All content is proprietary and confidential.