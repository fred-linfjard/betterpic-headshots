---
name: brainstorm
description: Turn a raw idea into a structured INITIAL.md. Use when the user 
  has a rough concept and wants to shape it before building.
---

# /brainstorm

Turn a raw idea into a well-structured INITIAL.md.

Read input from $ARGUMENTS, or from the conversation if no argument given.

## Step 1 — Read what's there
If the idea is already specific, skip to Step 3.
If it's vague, go to Step 2.

## Step 2 — Ask focused questions (max 4, all in one message)
Only ask what you can't infer:
1. "What does success look like — what will you be able to do that you can't now?"
2. "Who uses it — just you, your team, or end users?"
3. "Stack preference, or should I choose?"
4. "Any gotchas you already know about?"
5. "What's explicitly out of scope?"

## Step 3 — Write INITIAL.md
Save to INITIAL.md in current directory.

## FEATURE:
[2-5 sentences: what's being built, why, core user action "A user can..."]
- [Specific capability bullet]
- [Specific capability bullet]

## EXAMPLES & DOCUMENTATION:
[Relevant GitHub repos, API docs, reference links]

## OTHER CONSIDERATIONS:
- [Gotcha — things AI commonly misses for this type of task]
- [Env var / auth / rate limit notes]
- [Explicit out-of-scope]

## SUCCESS LOOKS LIKE:
[Specific testable outcome: "Run X, you should see Y"]

## Step 4 — Tell the user
✅ INITIAL.md written

[2 sentence summary]

Anything to adjust?
→ Feel it first: /local-mvp INITIAL.md
→ Build it properly: /generate-prp INITIAL.md
