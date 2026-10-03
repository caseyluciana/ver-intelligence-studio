---
name: Supplier Portal Data Integration
description: Planned integration — supplier portal submissions feed into vendor platform data
type: project
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
User wants supplier portal form submissions to populate/update vendor data in the vendor platform (registry, dossier, etc.).

**Why:** Closes the loop so vendors self-serve their own profile data rather than requiring manual VER entry.

**Options to evaluate next session:**
1. localStorage bridge — simplest, same-browser only, demo-friendly
2. Portal exports JSON/CSV → manually imported into vendors.js — auditable, fits static arch
3. Google Sheets as middle layer — portal writes to sheet, vendors.js reads from it — scales best, fits existing static architecture

**How to apply:** Start next session by picking the integration approach before building anything. Google Sheets is likely the right answer given the static-only constraint and the need for multi-user access.
