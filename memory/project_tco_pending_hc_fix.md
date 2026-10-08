---
name: TCO — Pending HC Explainer Fix
description: "What Are Hidden Costs?" section still not clickable on the live TCO URL; root cause identified, fix not yet applied
type: project
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
HC explainer ("What Are Hidden Costs?") is still unclickable on the live deployed TCO tool.

**Root cause:** Same hit-target problem as AI Impact — the `hc-explainer-head` div has `id="hc-head"` and the delegator matches on that ID, but the click target is actually a child element (`hc-explainer-title`, `hc-explainer-icon`, or `hc-toggle-icon`). However, unlike AI Impact, the `hc-head` div IS the outer wrapper — so bubbling should reach it. Need to investigate whether the delegator bubble-walk is failing on this element or if there's a z-index / pointer-events issue preventing clicks from reaching it at all.

**What already works:** AI Impact toggle fixed by adding `id="ai-panel-head"` to the header div and widening the click target — same pattern should work for HC if needed.

**Fix to try next session:**
1. Add `cursor:pointer` to `.hc-explainer-head` CSS and verify no `pointer-events:none` on children
2. If still broken, add a wrapping delegator ID like `id="hc-explainer-head-btn"` and match it in the delegator, same pattern as `ai-panel-head`
3. Rebuild with `build_tco.py` and deploy to link `01M1DQPTSFNMTYD3DGT9TNBMRF`

**Why:** Both tco_standalone.html and page_tco.html must be updated together (TCO parallel rule).

**How to apply:** Check this first thing next session before doing anything else on TCO.
