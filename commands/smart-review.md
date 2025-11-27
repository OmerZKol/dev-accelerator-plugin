# Smart Code Review Command

You are performing a comprehensive code review. Your goal is to provide actionable, constructive feedback that improves code quality.

## Context
{{#if selection}}
**Selected Code:**
```
{{selection}}
```

**File:** {{filePath}}
{{else}}
**File:** {{filePath}}

Please review the entire file.
{{/if}}

## Review Process

Follow this systematic approach:

### 1. UNDERSTAND
- Read the code carefully
- Understand the purpose and intent
- Identify the problem being solved
- Note the context and dependencies

### 2. ANALYSE

Check for these critical areas:

**Correctness**
- Logic errors or bugs
- Edge cases not handled
- Incorrect assumptions
- Off-by-one errors

**Security**
- Input validation missing
- SQL injection vulnerabilities
- XSS vulnerabilities
- Authentication/authorization issues
- Sensitive data exposure
- Command injection risks

**Performance**
- Inefficient algorithms (O(n²) when O(n) possible)
- Unnecessary loops or computations
- Memory leaks
- Blocking operations
- Missing caching opportunities

**Maintainability**
- Code clarity and readability
- Function/variable naming
- Code duplication
- Single Responsibility Principle violations
- Deep nesting (> 3 levels)
- Function length (> 50 lines)

**Testing**
- Missing test coverage
- Edge cases not tested
- Error paths not tested

**Best Practices**
- Language/framework idioms
- Design patterns misused
- Modern syntax opportunities
- Error handling quality

### 3. PRIORITIZE

Categorize issues:
- **CRITICAL**: Security vulnerabilities, data loss, crashes
- **HIGH**: Bugs, performance issues, maintainability problems
- **MEDIUM**: Minor improvements
- **LOW**: Style preferences, nitpicks

### 4. PROVIDE FEEDBACK

For each issue found:

1. **What**: Clearly state the problem
2. **Why**: Explain why it's problematic
3. **How**: Provide a specific solution with code example
4. **Where**: Reference line numbers or code sections

**Format:**
```markdown
### [PRIORITY] Issue Title

**Problem:** [Clear description]

**Location:** [Line numbers or code reference]

**Why it matters:** [Impact and consequences]

**Suggested fix:**
[Provide actual code example]

**Additional context:** [Any relevant information]
```

### 5. RECOGNIZE GOOD CODE

Don't just focus on problems. Mention the following aswell:
- Well-designed solutions
- Clear naming
- Good error handling
- Thoughtful edge case handling
- Effective patterns

## GUARDS (Important)

**DO:**
- Be specific with line numbers and code examples
- Prioritize security and correctness over style
- Provide actionable, implementable suggestions
- Explain the "why" behind each suggestion
- Acknowledge good code when you see it

**DON'T:**
- Make vague criticisms without solutions
- Nitpick code style unless it impacts readability
- Suggest changes without explaining benefits
- Assume the developer's skill level
- Focus only on negatives

## Output Format

Provide your review in this structure:

```markdown
## Code Review Summary

**Overall Assessment:** [Brief 2-3 sentence overview]

---

## Critical Issues
[List CRITICAL priority items]

## High Priority Issues
[List HIGH priority items]

## Medium Priority Issues
[List MEDIUM priority items]

## Positive Observations
[Call out well-done aspects]

## Recommendations
[3-5 key actionable next steps]

---

**Review completed.** Focus on critical and high-priority items first.
```

Begin your review now.
