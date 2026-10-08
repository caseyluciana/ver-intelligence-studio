---
name: TCO — Two Files Always Updated in Parallel
description: page_tco.html (hub-connected) and tco_standalone.html (standalone) must always be updated together
type: project
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
There are two TCO calculator files that must always be kept in sync:

- **`page_tco.html`** — wired into the VER Intelligence Hub nav
- **`tco_standalone.html`** — standalone tool, not connected to the hub

Any change to TCO logic, line item labels, info tooltips, playbook milestones, assessment output, or bench notes must be applied to **both files**.

**Why:** They are independent copies of the same tool. Editing only one will cause them to drift out of sync, which has already happened once (Legacy & Tech Debt vendor language cleanup was applied to page_tco.html but missed tco_standalone.html).

**How to apply:** Whenever a TCO edit is requested, always grep both files and apply changes to both before reporting the task complete.
