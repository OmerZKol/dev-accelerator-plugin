# Dev Accelerator

> Claude Code plugin for code quality, testing, and developer productivity
---

NOTE: 3 of the 5 components have been tested and verified to work. Those 3 are commands, agents and skills.

## Architecture

This plugin implements all 5 core Claude Code components working together:

### 1. **Commands** (Quick Actions)

| Command | Purpose |
|---------|---------|
| `/smart-review` | Comprehensive code review with quality checks |
| `/gen-tests` | Generate complete test suites with edge cases |

### 2. **Skills** (AI Workflows)

#### Safe Refactoring
Incremental refactoring with safety nets:
1. **Prepare**: Ensure tests exist
2. **Plan**: Break into small steps
3. **Refactor**: One change at a time, tests after each
4. **Validate**: Measure improvements
5. **Document**: Capture learnings

### 3. **Subagents** (Autonomous Agents)

#### Test Generator
Autonomously creates comprehensive test suites:
- Analyzes code structure
- Identifies test scenarios
- Generates happy path, edge cases, error tests
- Runs and validates tests
- Reports coverage

#### PR Reviewer
Comprehensive PR review:
- Analyzes all changes
- Security and performance checks
- Test coverage assessment
- Provides categorized feedback
- Recommends approve/changes

### 4. **MCP Servers** (External Integrations)

#### GitHub Integration Server
- Fetch PR information
- List changed files
- Get commit details
- Post PR comments
- Uses GitHub CLI (`gh`) when available

### 5. **Hooks** (Workflow Automation)

#### On Prompt Submit Hook
- Detects user intent (review, test, debug, refactor, docs)
- Suggests appropriate commands and skills
- Provides contextual tips
- Warns about incomplete prompts

#### On File Change Hook
- Runs linters automatically
- Checks for debug code (console.log, print)
- Warns about missing tests
- Detects large files
- Provides real-time feedback

---

## Installation & Usage

### Prerequisites

```bash
# Required
- Claude Code (^1.0.0)
- Node.js (v14+)

# Optional (for enhanced features)
- GitHub CLI (gh) for GitHub integration
- ESLint for JavaScript linting
- Pylint for Python linting
```

### Installation

1. move the code in the folder into your local .claude directory

2. **Enable in Claude Code**
   - Restart Claude Code
   - Plugins should be automatically loaded
   - Check with `/plugins` command

### Quick Start

#### 1. Code Review
```bash
# Select code in your editor, then:
/smart-review

# Or trigger the skill:
"Review this code for bugs and security issues"
```

#### 2. Generate Tests
```bash
# Select a function/class, then:
/gen-tests

# Or use the subagent:
"Generate comprehensive tests for this module"
```


---

## Feature Demonstrations

### Demo 1: Smart Code Review

**Before:**
```javascript
function calculatePrice(items, discount) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total - discount;
}
```

**Run:** `/smart-review`

**Output:**
```markdown
## Code Review Summary

**Critical Issues:**
1. Off-by-one error: Loop condition `i <= items.length` will cause array out of bounds
2. Missing input validation: No null/undefined checks
3. Logic bug: Can return negative prices

**Suggested Fix:**
```javascript
function calculatePrice(items, discount = 0) {
  if (!items || !Array.isArray(items)) {
    throw new Error('items must be an array');
  }

  let total = 0;
  for (let i = 0; i < items.length; i++) { // Fixed: < instead of <=
    const item = items[i];
    if (item && typeof item.price === 'number' && typeof item.quantity === 'number') {
      total += item.price * item.quantity;
    }
  }

  return Math.max(0, total - discount); // Prevent negative prices
}
```
```

### Demo 2: Test Generation

**Input Code:**
```javascript
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

**Run:** `/gen-tests`

**Generated Tests:**
```javascript
describe('isValidEmail', () => {
  describe('happy path', () => {
    it('should return true for valid email address', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should return false for email without @', () => {
      expect(isValidEmail('userexample.com')).toBe(false);
    });

    it('should return false for email without domain', () => {
      expect(isValidEmail('user@')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle null input', () => {
      expect(isValidEmail(null)).toBe(false);
    });

    it('should handle undefined input', () => {
      expect(isValidEmail(undefined)).toBe(false);
    });
  });
});
```

### Demo 3: Automated Quality Checks (Hooks)

**When you modify a file:**

```
✅ ESLint: utils.js passed
⚠️  Found 2 console.log statements in utils.js
⚠️  No test file found for utils.js. Consider creating utils.test.js
📝 Found 3 TODO/FIXME comments in utils.js
```

**Automatic suggestions based on your prompts:**

```
User: "I need to refactor this code"

💡 Tip: The safe-refactoring skill ensures you refactor safely with tests
💡 Remember: refactor in small steps, running tests after each change
```

---

## Configuration

### MCP Servers

The GitHub Integration server requires GitHub CLI:

```bash
# Install GitHub CLI
brew install gh        # macOS
# or visit: https://cli.github.com/

# Authenticate
gh auth login
```

### Customization

Edit `plugin.json` to:
- Enable/disable specific components
- Modify command descriptions
- Adjust skill triggers
- Configure hook behavior

---

## How Components Work Together

### Example Workflow: Feature Development

1. **Write Code**
   - On file change, hook checks for console.log, missing tests

2. **Review Code**
   - Use `/smart-review` command
   - Identifies bugs, security issues, improvements

3. **Generate Tests**
   - Use `/gen-tests` or test-generator subagent
   - Creates comprehensive test suite
   - Validates all tests pass

4. **Continuous Improvement**
   - Hooks provide real-time feedback
   - Skills ensure best practices

---

## Technical Details

### Technology Stack

- **Language**: JavaScript (Node.js)
- **MCP Protocol**: @modelcontextprotocol/sdk
- **Integrations**: GitHub CLI, ESLint, Pylint
- **Testing**: Works with Jest, Mocha, pytest, JUnit

### File Structure

```
smartdev-accelerator/
├── plugin.json                 # Plugin configuration
├── package.json               # Dependencies
├── README.md                  # This file
│
├── mcp-servers/               # MCP Servers
│   └── github-server.js       # GitHub integration
│
├── commands/                  # Slash commands
│   ├── smart-review.md        # Code review command
│   └── gen-tests.md          # Test generation
│
├── skills/                    # AI workflow skills
│   └── safe-refactoring.md
│
├── subagents/                 # Autonomous agents
│   ├── test-generator.md      # Test generation agent
│   └── pr-analyzer.md        # PR review agent
│
└── hooks/                     # Workflow hooks
    ├── on-prompt-submit.js    # Prompt enhancement
    └── on-file-change.js      # File change automation
```

### Design Decisions

**Why Multi-Phase Skills?**
- Ensures thoroughness (can't skip steps)
- Quality gates prevent proceeding with incomplete analysis
- Systematic approach catches more issues

**Why Autonomous Subagents?**
- Can work independently without constant supervision
- Parallel execution for faster results
- Specialized expertise per domain

**Why Both Commands and Skills?**
- Commands: Quick, direct access
- Skills: Triggered automatically based on context
- Flexibility for different workflows

**Why Hooks?**
- Real-time feedback during development
- Catch issues before they become problems
- Enhance user prompts with context

---

## Reflection

### What Works Well

1. **Comprehensive Coverage**: All 5 component types working together
2. **Real Problems Solved**: Addresses developer pain points
3. **Quality Gates**: Skills enforce thoroughness with phase completions
4. **Real-Time Feedback**: Hooks provide immediate context

### What I Would Improve With More Time

1. **Testing**
   - Add unit tests for MCP servers
   - Integration tests for component interactions
   - Test and verify the MCP server and hooks work

2. **MCP Servers**
   - Add more external integrations (Jira, Slack, Database)
   - Implement actual GitHub API calls (not just CLI wrapper)
   - Add caching for performance
   - Better error recovery

3. **Enhanced Analytics**
   - Track which features are most used
   - Measure time saved
   - Identify patterns in code issues
   - Dashboard for team metrics

4. **AI Improvements**
   - Fine-tune prompts based on real usage
   - Add more guards against edge cases
   - Implement feedback loop for prompt refinement
   - Add context from previous sessions

5. **User Experience**
   - Better error messages
   - Progress indicators for long-running agents
   - Keyboard shortcuts

6. **Additional Features**
   - PR summary generation
   - Documentation automation
   - Architecture decision records (ADR) generator
   - Dependency update suggestions
   - Breaking change detector
   - Performance regression checker
   - Security vulnerability scanner

### Trade-Offs Made

**Breadth vs Depth**
- Chose to implement all 5 components (breadth)
- Could have made fewer components more sophisticated
- Justification: Shows full capability of plugin system

**Mock vs Real Integrations**
- GitHub MCP uses CLI wrapper, falls back returns error messages
- Could have implemented direct API calls

---

## Troubleshooting

### Commands Not Appearing

**Problem**: Slash commands not showing up

**Solutions**:
- Verify plugin is in correct directory: `~/.claude/plugins/smartdev-accelerator`
- Check plugin.json syntax is valid
- Restart Claude Code
- Try `/plugins` to see loaded plugins

### Hooks Not Running

**Problem**: File change hook not triggering

**Solutions**:
- Ensure hooks have execute permissions: `chmod +x hooks/*.js`
- Check for JavaScript syntax errors
- Review Claude Code logs
- Verify hook configuration in plugin.json

---
