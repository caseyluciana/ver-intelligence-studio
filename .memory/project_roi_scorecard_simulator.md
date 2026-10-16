---
name: ROI Scorecard — True Cost Simulator
description: simCalc bakes in TOKEN_RATE_PER_HR=$5/hr; complexity requires conscious selection; Time Saved auto-fills from preHrs-aiHrs
type: project
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
`roi_value_scorecard.html` — True Cost Simulator state as of Oct 9, 2026.

**simCalc returns:** preHrs, preCost, laborCost, tokenCost, afterCost, delta, mult
- `afterCost = (aiHrs × $150 FTE) + (aiHrs × $5 token rate)`
- TOKEN_RATE_PER_HR = $5/hr derived from AI Cost Monitor (Anthropic Claude $3.23/hr VER team avg, rounded up conservatively)
- SEED_VERSION = 4 (bumped when token cost added to seed sim objects)

**Drawer UX:**
- Complexity select has no default — requires conscious pick (Simple/Moderate/Complex/Enterprise)
- Time Saved auto-populates with `preHrs - aiHrs` via same `_manuallySet` pattern as Cost Avoided
- Both fields editable/overridable; edit mode restores saved values and marks them manually set

**Modal breakdown shows:**
- Build Hours (pre vs after)
- Blended Rate
- Labor Cost (pre vs after)
- AI Token Cost (— vs calculated)
- Total Cost (pre vs after)
- Cost Avoided row + footer with "AI tokens @ $5/hr (VER avg)"

**Why:** Casey wanted true net ROI — show the cost of AI tooling is accounted for, making the savings number defensible to Joe/Roger. Token cost is a rounding error vs labor savings (VER Hub: $400 tokens vs $51,600 net savings) which actually strengthens the story.

**How to apply:** Any future update to TOKEN_RATE_PER_HR should also bump SEED_VERSION to clear localStorage.
