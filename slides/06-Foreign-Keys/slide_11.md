# What if a referenced value changes?

Suppose that we have a few **chapters** belonging to **book #3**.

If we try to delete **book #3**, that would violate referential integrity because it would cause the **book_id** fields of those chapters to be invalid!

This will throw an error and not allow us to delete the book.

---

*All content is proprietary and confidential.*