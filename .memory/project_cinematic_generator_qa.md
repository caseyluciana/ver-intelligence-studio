---
name: Cinematic Generator — Output Formatting QA
description: Generated cinematics have layout issues (too big, off-center, misaligned) that need to be audited and fixed per meeting type
type: project
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
The Cinematic Generator (page_cinematic_generator_v2.html) generates HTML presentations for multiple meeting types. The generated output formatting is broken — things too big, off-center, misaligned.

**Discovered:** Offsite cinematic was the first confirmed broken type.

**Goal:** Audit every meeting type the generator supports, identify layout issues in the generated HTML template/output, and fix them so every generated cinematic is as clean and polished as VER_Hub_ROI_Cinematic.html.

**Why:** The generator is part of the standalone toolkit and is referenced in the ROI story as a key deliverable. Broken output undermines that story.

**How to apply:** Start by reading page_cinematic_generator_v2.html to understand what templates it uses per meeting type, then generate one of each type and inspect the output. Fix issues in the generator templates (not the output files) so all future generates are clean. Prioritize: Offsite (confirmed broken), then check CQBR, MBR, team review, exec steerco, etc.
