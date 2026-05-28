# Cascade

We know what a stylesheet is now, but what is the **cascading algorithm**? It determines which styles apply to an element, and follows this order:

1. **Relevance**: only look at rules with selectors that apply to the element.

2. **Origin and importance**: determine where the style comes from and its importance
   a. **User agent styles** are the default browser styles that will be overwritten by *user* and *developer* styles.
   b. A declaration marked as `!important` will override normal styles, but *avoid* using this if possible.

3. **Specificity**: if two rules apply to the same element, the more specific one wins.
   a. ID > class > tag name

4. **Order of appearance**: a style that appears *later* (such as further down in the file) will override earlier styles

---

*All content is proprietary and confidential.*