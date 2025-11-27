---
name: safe-refactoring
description: Provides a safe, systematic approach to refactoring code with confidence that behavior is preserved
---

# Safe Refactoring Skill

This skill provides a safe, systematic approach to refactoring code with confidence that behavior is preserved.

## When to Use This Skill

Activate this skill when:
- User wants to "refactor", "restructure", or "clean up code"
- Code is working but needs improvement
- Code is difficult to maintain or understand
- Technical debt needs to be addressed
- Preparing code for new features

## Refactoring Philosophy

**Main Principle:** Refactoring changes the structure, NOT the behavior.

**Key Principles:**
1. Tests must pass before and after
2. Small, incremental changes
3. Commit after each safe step
4. Never refactor and add features simultaneously
5. Behavior remains identical

---

## PHASE 1: PREPARE & PROTECT

**Goal:** Establish a safety net before making changes.

**Actions:**

1. **Ensure Tests Exist**
   - Check for existing tests
   - If tests don't exist or coverage is poor, STOP
   - Add tests FIRST before refactoring

2. **Run Current Tests**
   - All tests must pass
   - Fix any failing tests first
   - Establish baseline

3. **Understand Current Behavior**
   - Read the code thoroughly
   - Understand what it does
   - Identify inputs and outputs
   - Note side effects

4. **Identify Scope**
   - What needs refactoring?
   - What is the goal of refactoring?
   - What will NOT change?

**Pre-Refactoring Checklist:**

```markdown
## Refactoring Preparation

### Current State
- [ ] Tests exist and cover the code
- [ ] All tests passing (baseline established)
- [ ] Code behavior understood
- [ ] No pending changes in version control

### Refactoring Goal
**What:** [What code is being refactored]
**Why:** [Why this refactoring is needed]
**Outcome:** [Expected improvement]

### Safety Measures
- [ ] Version control available
- [ ] Can revert if needed
- [ ] Tests provide safety net
```

**Quality Gate:**
- [ ] Tests exist with adequate coverage
- [ ] All tests passing
- [ ] Code behavior fully understood
- [ ] Refactoring goal clearly defined

**DO NOT PROCEED** without adequate test coverage.

---

## PHASE 2: PLAN THE REFACTORING

**Goal:** Break refactoring into small, safe steps.

**Actions:**

1. **Identify Bad Code**
   - Long functions (> 50 lines)
   - Duplicated code
   - Large classes
   - Long parameter lists
   - Deeply nested logic
   - Poor naming
   - Magic numbers/strings
   - Complex conditionals

2. **Choose Refactoring Pattern**

   **Common Refactorings:**

   **Extract Method/Function**
   - Break long functions into smaller ones
   - Each function has single purpose

   **Rename Variable/Function**
   - Improve clarity
   - Use intention-revealing names

   **Extract Variable**
   - Name complex expressions
   - Improve readability

   **Remove Duplication**
   - DRY (Don't Repeat Yourself)
   - Extract common code

   **Simplify Conditionals**
   - Extract complex conditions to named functions
   - Use guard clauses
   - Replace nested ifs with early returns

   **Introduce Parameter Object**
   - Replace long parameter lists
   - Group related parameters

   **Replace Magic Numbers**
   - Use named constants
   - Improve maintainability

3. **Order the Steps**
   - Start with safest refactorings first
   - One refactoring at a time
   - Build on previous changes

**Refactoring Plan:**

```markdown
## Refactoring Steps

### Step 1: [Name of refactoring]
**Type:** [Extract method / Rename / etc.]
**Risk:** [Low / Medium / High]
**What:** [Specific change]
**Why:** [Benefit]

### Step 2: [Name of refactoring]
**Type:** [Extract method / Rename / etc.]
**Risk:** [Low / Medium / High]
**What:** [Specific change]
**Why:** [Benefit]

### Step 3: [Name of refactoring]
**Type:** [Extract method / Rename / etc.]
**Risk:** [Low / Medium / High]
**What:** [Specific change]
**Why:** [Benefit]

[Continue for all planned steps...]
```

**Quality Gate:**
- [ ] Bad code identified
- [ ] Refactoring steps planned
- [ ] Steps ordered from safest to riskiest
- [ ] Each step has clear goal

---

## PHASE 3: REFACTOR INCREMENTALLY

**Goal:** Execute refactoring in small, verified steps.

**Process for Each Step:**

1. **Make One Small Change**
   - Follow the plan
   - Make minimal modification
   - Change structure, not behavior

2. **Run Tests**
   - All tests must still pass
   - If tests fail, revert and try different approach

3. **Verify Behavior**
   - Code still works as before
   - No new bugs introduced
   - Performance not degraded

4. **Commit**
   - Commit after each successful step
   - Clear commit message
   - Can revert if needed

**Refactoring Step Template:**

```markdown
## Step [N]: [Refactoring Name]

### Before:
```[language]
[Code before refactoring]
```

### After:
```[language]
[Code after refactoring]
```

### Changes:
- [Change 1]
- [Change 2]

### Verification:
- [ ] Code compiles/runs
- [ ] All tests pass
- [ ] Behavior unchanged
- [ ] Committed to version control

### Benefits:
- [Improvement 1]
- [Improvement 2]
```

**CRITICAL RULES:**

1. **Run tests after EVERY change**
2. **If tests fail, REVERT immediately**
3. **Never skip steps**
4. **Commit after each successful step**
5. **If stuck, break into smaller steps**

**Quality Gate (For Each Step):**
- [ ] Change is small and focused
- [ ] Tests run and pass
- [ ] Behavior is identical
- [ ] Change committed

**DO NOT PROCEED** to next step if tests fail.

---

## PHASE 4: VALIDATE & IMPROVE

**Goal:** Ensure refactoring achieved its goal and code is better.

**Actions:**

1. **Run Full Verification**
   - All tests pass
   - Manual testing in realistic scenarios
   - Performance check (no degradation)
   - Code review quality

2. **Measure Improvement**

   **Before vs After:**
   - Lines of code
   - Complexity score
   - Number of functions
   - Duplication percentage
   - Readability score

3. **Quality Assessment**

   ```markdown
   ## Refactoring Results

   ### Metrics
   | Metric | Before | After | Change |
   |--------|--------|-------|--------|
   | Lines of Code | [N] | [N] | [±N] |
   | Functions | [N] | [N] | [±N] |
   | Complexity | [N] | [N] | [±N] |
   | Max Nesting | [N] | [N] | [±N] |

   ### Improvements
   ✅ [Improvement 1]
   ✅ [Improvement 2]
   ✅ [Improvement 3]

   ### Code Health
   - Readability: [Better / Same / Worse]
   - Maintainability: [Better / Same / Worse]
   - Testability: [Better / Same / Worse]
   - Performance: [Better / Same / Worse]
   ```

4. **Additional Improvements**
   - Documentation added?
   - Comments improved?
   - Tests enhanced?
   - Edge cases better handled?

**Quality Gate:**
- [ ] All tests passing
- [ ] Code measurably improved
- [ ] No performance degradation
- [ ] Code review shows quality increase

---

## PHASE 5: DOCUMENT & REFLECT

**Goal:** Capture learnings and document changes.

**Actions:**

1. **Update Documentation**
   - Update code comments
   - Update API documentation
   - Note design decisions
   - Update README if needed

2. **Create Summary**

   ```markdown
   # Refactoring Summary

   ## Objective
   [What we set out to improve]

   ## Changes Made
   - [High-level change 1]
   - [High-level change 2]
   - [High-level change 3]

   ## Files Modified
   - [file_path] - [description of changes]
   - [file_path] - [description of changes]

   ## Improvements Achieved
   1. **[Improvement]**: [Before] → [After]
   2. **[Improvement]**: [Before] → [After]
   3. **[Improvement]**: [Before] → [After]

   ## Test Results
   - Total tests: [count]
   - All passing: ✅
   - Coverage: [before]% → [after]%

   ## Next Steps
   - [ ] [Follow-up refactoring if needed]
   - [ ] [Documentation updates]
   - [ ] [Additional testing]

   ## Lessons Learned
   - [Lesson 1]
   - [Lesson 2]
   ```

3. **Reflect on Process**
   - What worked well?
   - What was challenging?
   - What would you do differently?
   - Patterns to reuse?

**Quality Gate:**
- [ ] Documentation updated
- [ ] Summary created
- [ ] Changes well-documented
- [ ] Team can understand what changed and why

---

## FINAL OUTPUT

```markdown
# Refactoring Complete ✅

## Summary
[Brief overview of refactoring]

## Goal Achieved
**Objective:** [Original goal]
**Result:** [What was achieved]

## Changes
**Files Modified:** [count]
**Lines Changed:** [count]
**Commits:** [count]

## Quality Improvements
- [Improvement 1]
- [Improvement 2]
- [Improvement 3]

## Verification
- ✅ All tests passing ([count] tests)
- ✅ Behavior unchanged
- ✅ Performance maintained
- ✅ Code quality improved

## Metrics
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| [Metric] | [Value] | [Value] | [±Value] |

---

**Code is now cleaner, more maintainable, and ready for future development.**
```

---

## GUARDS (CRITICAL!)

**MUST DO:**
- ✅ Have adequate test coverage BEFORE refactoring
- ✅ Run tests after EVERY change
- ✅ Make small, incremental changes
- ✅ Commit after each successful step
- ✅ Preserve exact behavior
- ✅ Measure and verify improvements
- ✅ Revert if tests fail

**MUST NOT DO:**
- ❌ Refactor without tests
- ❌ Change behavior during refactoring
- ❌ Make large changes all at once
- ❌ Add features while refactoring
- ❌ Skip running tests
- ❌ Commit broken code
- ❌ Refactor "just because" without clear goal

**IF TESTS FAIL:**
1. STOP immediately
2. REVERT the change
3. Analyze what went wrong
4. Make a smaller change
5. Try again

## Common Refactoring Patterns

**Extract Function:**
```javascript
// Before
function process(data) {
  // 50 lines of complex logic
  const result = data.filter(x => x.value > 10 && x.active && !x.deleted);
  // more logic
}

// After
function process(data) {
  const filtered = filterActiveHighValueItems(data);
  // more logic
}

function filterActiveHighValueItems(data) {
  return data.filter(x => x.value > 10 && x.active && !x.deleted);
}
```

**Rename for Clarity:**
```javascript
// Before
function calc(a, b) { return a * b * 0.15; }

// After
function calculateSalesTax(price, quantity) {
  const TAX_RATE = 0.15;
  return price * quantity * TAX_RATE;
}
```

**Replace Magic Number:**
```javascript
// Before
if (age > 18) { /* ... */ }

// After
const LEGAL_AGE = 18;
if (age > LEGAL_AGE) { /* ... */ }
```

## Success Criteria

A successful refactoring has:
1. ✅ All tests passing (before and after)
2. ✅ Behavior perfectly preserved
3. ✅ Code quality measurably improved
4. ✅ Changes documented
5. ✅ Small, incremental commits
6. ✅ Clear improvement in maintainability

**Now begin PHASE 1: PREPARE & PROTECT.**
