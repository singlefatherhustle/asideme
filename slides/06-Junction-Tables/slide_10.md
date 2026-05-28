# Many-to-many relationship

There is a **many-to-many (M-N)** relationship between **courses** and **students** because both statements are true:

- 1 **course** has many **students**
- 1 **student** has many **courses**

Where should the foreign key go to represent this relationship?

## Diagram

```
Student 1          Student 2          Student 3
   |                  |                  |
   |-- (dashed)  --|-- (dashed)  --|-- (dotted)
   |                  |                  |
   |-- (dashed)  --|-- (dashed)  --|-- (dotted)
   |                  |                  |
   |-- (dashed)  --|-- (dotted)  --|-- (dotted)

Course 1          Course 2          Course 3
```

The diagram shows three students (represented as stick figures) connected to three courses (represented as platform icons) through multiple dashed and dotted lines, illustrating the many-to-many relationship where each student can enroll in multiple courses and each course can have multiple students.

---

*All content is proprietary and confidential.*

Page 7