# Candor — Build Recovery

Backups are created before any significant restructure. Filename format: `interview_prep_coach_YYYY-MM-DD_HHMM.html`.

## To restore a backup

```bash
# List available backups
ls backups/

# Restore a specific backup
cp backups/interview_prep_coach_2026-10-03_0409.html interview_prep_coach.html
```

## Recovery rule

Before any major edit session, Ashborn creates a dated backup automatically.
The most recent backup = last approved working build.

## Git recovery (fastest)

```bash
# See commit history
git log --oneline interview_prep_coach.html

# Restore to a specific commit
git checkout <commit-sha> -- interview_prep_coach.html
```
