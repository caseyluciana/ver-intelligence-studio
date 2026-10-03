---
name: Chief of Staff — Two Separate Modules
description: The CoS in team_portal.html (daily auto-briefing infographic) is distinct from the standalone chief_of_staff.html (personal Slack-integrated tool); do not cross-link them
type: project
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
There are TWO Chief of Staff concepts that must stay separate:

1. **Team Portal CoS** (`team_portal.html` built-in modal) — auto-checks portfolio health and generates a daily briefing infographic for the whole team when they open the portal. Lives as the "Today's Briefing" button. This is a team-level view.

2. **Standalone CoS** (`chief_of_staff.html`) — a personal AI chief of staff that individuals (especially the director) can link to Slack, calendar, and other personal tools. NOT wired to the team portal. NOT in the team portal sidebar.

**Why:** User clarified that the standalone CoS is meant for individual productivity/integration use, not team operations. Mixing them would confuse the two audiences.

**How to apply:** Never add `chief_of_staff.html` back to the team portal sidebar. Never describe the team briefing modal as the same thing as the standalone CoS module.
