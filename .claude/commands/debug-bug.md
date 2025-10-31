---
description: Launch systematic bug debugging workflow
---

# Systematic Bug Debugging

Follow the debugging methodology defined in `.claude/skills/bug-finder/` and `.claude/skills/debugger/` to systematically analyze and resolve bugs.

## Debugging Process (from `.claude/skills/`):

### Step 1: Define the Bug
- Clearly state the observed bug behavior
- Describe expected vs actual behavior
- Provide reproduction steps if known

### Step 2: Reproduce
- Reproduce the bug locally or via test
- Create minimal reproduction case if possible
- Document exact conditions that trigger the bug

### Step 3: Formulate Hypotheses
- List top 2-3 likely root causes
- Rank by likelihood and impact
- Explain reasoning for each hypothesis

Example format:
1. **Hypothesis 1** (High confidence): [Description]
   - Why: [Reasoning]
   - Impact: [High/Medium/Low]

2. **Hypothesis 2** (Medium confidence): [Description]
   - Why: [Reasoning]
   - Impact: [High/Medium/Low]

### Step 4: Investigate
- Log and inspect relevant state changes
- Use binary search to narrow down cause
- Add temporary logging if needed
- Check related code paths

### Step 5: Verify Root Cause
- Write failing test if reproduction is possible
- Confirm the exact cause before fixing

### Step 6: Fix with Minimal Change
- Apply focused, minimal fix
- Avoid refactoring during bug fix
- Keep changes surgical and targeted

### Step 7: Validate Fix
- Run full test suite
- Verify bug is resolved
- Check for regression

### Step 8: Add Protection
- Add test to prevent regression
- Add guards or validation if needed
- Document root cause if complex

### Step 9: Prevention
- Suggest systematic improvements to prevent similar bugs:
  - Additional tests
  - Type guards
  - Validation rules
  - Architectural changes

## Usage:
Provide the bug description, and this workflow will guide the systematic investigation and resolution.
