---
name: TCO — Direct _wire() for post-hardener click handlers
description: For deployed TCO elements that need click handlers, use _wire() in initStaticHandlers — delegator alone is not reliable post-hardener
type: feedback
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
For elements in tco_standalone.html that must survive the Cloud Hosting hardener, direct `_wire(id, 'click', fn)` calls inside `initStaticHandlers` are more reliable than the document-level delegator alone.

**Why:** The hardener strips onclick attribute values AND can affect how events bubble in some edge cases. The delegator works for theme toggle (matched by stable id) and AI Impact (after widening the hit target), but "What Are Hidden Costs?" required direct wiring to every child element ID to finally work.

**How to apply:** When adding a new interactive element to tco_standalone.html that will be deployed:
1. Give the element and all its clickable children unique IDs
2. Add `_wire('element-id', 'click', handlerFn)` for each in `initStaticHandlers`
3. Keep the delegator entry as a backup, but don't rely on it alone
4. Rebuild via `build_tco.py` and deploy to link `01M1DQPTSFNMTYD3DGT9TNBMRF`
