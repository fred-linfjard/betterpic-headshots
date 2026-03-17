---
name: execute-prp
description: Execute a PRP to build a feature phase by phase with validation 
  gates. Use after reviewing and approving a generated PRP.
---

# /execute-prp

Build from an approved PRP, phase by phase.

Read from $ARGUMENTS. If not found: "Run /generate-prp first."

## Before starting
1. Read the full PRP
2. Check CLAUDE.md for project rules
3. Check examples/ for patterns to match
4. Understand the success criteria

## Rules
- Work phases in order — no skipping
- Run each "✓ Done when" check before moving on
- Files under 300 lines — split if needed
- .env.example for secrets, never .env
- Update TASK.md as you go (create if missing)

## On errors
Try to fix (2 attempts). If still failing, stop and report:
- What you were doing
- Exact error
- What you tried
- What you need to proceed

## When done
Update or create README.md (one sentence, how to run, env vars).

✅ Done

Built: [what was created]
Run with: [command]
Files: [list]

[Any follow-up the user should know]
