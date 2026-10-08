---
name: Candor — Session Status Oct 2026
description: Current state of interview_prep_coach.html after major debug session; what works, what's next
type: project
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
Candor (interview_prep_coach.html) is fully functional as of 2026-10-03:
- Intro overlay: solid black background, no bleed-through
- Briefing flow: all 4 steps wired correctly, no stage/slot bugs
- Single practice: cold question delivery, no characteristic/category labels shown
- Mock interview: FIXED — root cause was `class="hidden"` with `display:none!important` on mock-inprogress-view and mock-report-view, overriding JS style.display calls. Fixed by replacing class="hidden" with style="display:none" on those elements.
- Hero: compacts (smaller wordmark, hides tagline/company row/theme toggle, smaller mode cards) when a mode is active; scrolls to top so content is visible
- Mode cards: active card gets bright ring, inactive card dims to 52% with "Switch to X →" text
- No focus area / characteristic / competency labels shown to user in any mode

**Why:** `!important` in `.hidden` CSS class was silently overriding every JS `style.display = 'block'` call — took extensive debugging to locate.

**How to apply:** Next session: apply Candor visual standard to hub and portal pages (index.html, team_portal.html, page_exec, page_renewal, page_governance, page_tco).
