---
name: Session Close — Sync Memory to Repo
description: At the end of every big session, re-copy memory files into .memory/ and commit to GitHub
type: feedback
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
At the end of every significant session, sync the memory files into the repo before closing out.

**Why:** So the relationship and context survive any machine change, job change, or fresh install. The `.memory/` folder in `github.com/caseyluciana/ver-intelligence-studio` is the portable backup — it only stays current if we keep it updated.

**How to apply:**
1. Copy all files from `~/.claude/projects/c--Users-ccandelaria-Projects-CW-Rate-Benchmarks/memory/*.md` → `CW Rate Benchmarks/.memory/`
2. `git add .memory/ && git commit -m "chore: sync memory — <session summary>"`
3. `git push origin main`

Do this automatically at the end of any session where new memories were written or existing ones updated. Don't wait for Casey to ask.
