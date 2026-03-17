# Playground

Fast iteration workspace. Move fast, stay clear, don't over-engineer.

## Workflow
/brainstorm  →  /local-mvp  →  /generate-prp  →  /execute-prp
                    ↑
              adjust & iterate

| Command | When | Output |
|---------|------|--------|
| `/brainstorm` | Raw idea | INITIAL.md |
| `/local-mvp INITIAL.md` | Feel the idea | Running prototype |
| `/generate-prp INITIAL.md` | Idea validated | PRPs/name.md |
| `/execute-prp PRPs/name.md` | PRP approved | Full build |

## Mindset
- Working beats beautiful
- Readable beats clever
- Always one command to run it
- Ask before assuming

## Stack — match the tool to the job
| Task | Default |
|------|---------|
| Web UI | Next.js (TS) or plain HTML/JS |
| API | Python + FastAPI or Node + Express |
| MCP server | Python or TypeScript |
| Script | Python |

## Rules
- Files under 300 lines
- Never touch .env — only .env.example
- Never git push from here — local only
- Flag security issues with ⚠️ SECURITY:
