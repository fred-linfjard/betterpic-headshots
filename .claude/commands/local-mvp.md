---
name: local-mvp
description: Build the fastest possible running prototype from INITIAL.md.
  Use when the user wants to feel and test an idea locally before committing 
  to a full build. Speed over completeness.
---

# /local-mvp

Get something running locally as fast as possible. No PRP, no spec.

Read from $ARGUMENTS (default: INITIAL.md).

## Constraints
- Runs with ONE command
- Max 3 files
- Hardcode what needs deciding later
- Mock external services if they slow you down
- No tests, no Docker, no deployment
- Local only

## What to build
Find the smallest thing that proves the core idea.
"What's the one screen / endpoint / script that lets the user say 
'yes, this is what I meant' or 'no, pivot'?"

| Idea type | Build |
|-----------|-------|
| Web UI | Single HTML file or minimal Next.js page, fake data fine |
| API | One file, 2-3 routes, in-memory data OK |
| Script | One file that runs and prints real output |
| MCP server | Minimal server, 1-2 tools wired up, no DB yet |

## When done report:
🚀 Local MVP ready

Run: [single command]
Open: [URL or "check terminal output"]

What's real: [list]
What's faked/mocked: [list]

---
Try it. Then tell me:
- Does this feel right?
- What's missing or wrong?
- Ready to build properly? → /generate-prp INITIAL.md

## The one rule you cannot break
It must run. Stub with fake data rather than leaving broken code.
