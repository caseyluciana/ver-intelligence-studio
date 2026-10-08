---
name: Vendor 360 Dossier — Design Decisions
description: Finalized layout and content decisions for test/vendor_detail.html
type: project
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
Dossier layout is settled and user-approved as of Jun 2026.

**Why:** Multiple iterations to reduce white space and improve readability.
**How to apply:** Don't re-litigate these decisions unless the user asks.

Key decisions:
- Vendor portal layout (.vp-wrap / .vp-side / .vp-main) — not the dark hub layout
- Back link goes to vendor_registry.html, not index.html
- Brandfetch logo in avatar (same pattern as registry), 50px size
- Advisory Notes + Capabilities side by side (50/50 grid) inside Overview card
- Location & Web card eliminated — Address and Website moved into Contract Snapshot as fields 8-9
- Contract Snapshot: 3-col grid, 9 fields (3+3+3, no orphan tile); Days Remaining dropped (duplicates KPI strip)
- Risk Breakdown: 3×2 compact tile grid (not horizontal bars) — score large, label, direction note, color-coded bottom border
- Peer comparison strip above dossier cards — top 3 by spend in same category, clickable to their dossier, hidden if no peers
- Spend KPI note shows portfolio % (computed from all 1,368 vendors)
- Source + confidence badges kept on KPI strip; last-refreshed date set dynamically from new Date()
- "FY27" removed from dossier content — subtitle says "Active Dossier"
- TCO Calculator added as first Quick Link
- No fake contact fields (supplier_rep_name/email/primary_contact all say "VER Team" — omitted)
