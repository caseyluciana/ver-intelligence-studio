---
name: HC 70/30 FTE/CW Policy
description: Leadership mandates a 70% FTE / 30% CW headcount split; baked into Demand Planning tool
type: project
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
Leadership wants to maintain a **70/30 headcount split**: 70% FTE (internal), 30% CW (contingent workforce/vendor).

**Why:** Policy directive from leadership — not a preference, a compliance target.

**How to apply:** The Demand Planning section of `test/page_forecast.html` already enforces this:
- 30% CW ceiling reference line rendered on the quarterly demand chart per quarter
- FTE/CW Split stat card (5th in the stats strip) colors green/amber/red based on compliance
- Ratio gauge in the config panel shows live FTE% vs CW% with a 70/30 marker
- FTE slider shows "70% target = X FTE for Y HC demand" hint dynamically
- Risk flags fire at >30% CW (breach) and >30% approaching (warn)

When discussing headcount strategy, sourcing decisions, or vendor engagement scope, flag if a proposal would push CW above 30% of total HC.
