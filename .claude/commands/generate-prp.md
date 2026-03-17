---
name: generate-prp
description: Generate a PRP from an INITIAL.md. Use when the idea is validated 
  and the user is ready to build properly with a full implementation blueprint.
---

# /generate-prp

Turn a validated feature brief into a focused implementation blueprint.

Read from $ARGUMENTS (default: INITIAL.md).
If neither exists: "Run /brainstorm first."

## Target: 80-150 lines. Longer = over-specifying.

## Step 1 — Research first
1. Scan existing codebase for patterns
2. Check examples/ folder
3. Fetch any URLs from EXAMPLES & DOCUMENTATION
4. Identify stack — if unspecified, choose and note your choice

## Step 2 — Write PRPs/[feature-name].md

# PRP: [Feature Name]

## What We're Building
[2-3 sentences. Plain English.]

## Stack
- Language: [e.g. TypeScript / Python 3.11]
- Key libs: [e.g. FastAPI, anthropic]
- Runs with: [command]

## File Structure
[Only files being created or changed]

## Implementation

### 1. [Phase]
- [ ] Step
- [ ] Step
✓ Done when: [testable outcome]

### 2. [Phase]
- [ ] Step
✓ Done when: [testable outcome]

### 3. Wire up + test
- [ ] Final integration step
✓ Done when: run [cmd], see [specific output]

## Key Details
[Only genuinely non-obvious sections — skip if nothing tricky]

## Environment Variables
VAR=description

## Out of Scope
- [Explicitly not building now]

## Success
- [ ] Runs: [command]
- [ ] [Visible outcome]
- [ ] No hardcoded secrets

Confidence: [X/10] — [one sentence reason]

## Step 3 — Tell the user
✅ PRP saved to PRPs/[name].md

[2 sentences on what will be built]

⚠️ Read it before running /execute-prp — check phases and any ⚠️ flags.
Run: /execute-prp PRPs/[name].md
