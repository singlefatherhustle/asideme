# Merge the sorted halves

The second phase is to merge the sorted halves back together.

## Merge Process Visualization

**Initial state (unsorted array):**
| 3 | 9 | 89 | -56 | 92 | 57 | 13 | 40 |

**Step 1 - Split into halves:**
| 3 | 9 | | -56 | 89 | | 57 | 92 | | 13 | 40 |

**Step 2 - Merge pairs:**
| -56 | 3 | 9 | 89 | | 13 | 40 | 57 | 92 |

**Step 3 - Merge final halves:**
| -56 | 3 | 9 | 13 | 40 | 57 | 89 | 92 |