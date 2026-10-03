---
name: Recovery — Auto-backup before major edits
description: Before any significant restructure, create a dated backup in backups/ and commit it; recovery path is either the backup file or git checkout
type: feedback
---

Before starting any major edit session (layout changes, new features, multi-file refactors), create a backup:

```bash
cp interview_prep_coach.html "backups/interview_prep_coach_$(date +%Y-%m-%d_%H%M).html"
```

**Why:** Gives Casey a guaranteed recovery point without needing to dig through git history. The `backups/` folder in the repo is the "last approved working build" safety net.

**How to apply:**
- Run the backup command before the first edit in any session that touches more than one logical section
- Commit the backup alongside the work (`git add backups/ interview_prep_coach.html`)
- Recovery: `cp backups/<dated-file>.html interview_prep_coach.html` or `git checkout <sha> -- interview_prep_coach.html`
- The git log for the specific file is the authoritative history: `git log --oneline interview_prep_coach.html`
