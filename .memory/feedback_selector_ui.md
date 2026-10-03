---
name: Selector UI — Prefer Dropdown Over Button Row
description: When there are more than ~5 options in a type/mode selector, use a styled dropdown instead of a pill button row
type: feedback
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
Prefer a `<select>` dropdown over a row of pill buttons when there are more than ~5 options. Casey confirmed this strongly ("LOOOOVE this revision") after the TCO type selector was converted from 8 pill buttons to a single labeled dropdown.

**Why:** Button rows with many options either overflow the layout, require horizontal scrolling (which hides items), or wrap to two lines — all of which feel messy. A dropdown keeps the UI compact and shows all options clearly.

**How to apply:** Any time a selector has 6+ options, default to a styled `<select>` with a label. Use the pattern: `<span class="type-select-label">Label</span> + <select class="type-dropdown">`. Keep the CSS consistent: rounded border, teal focus ring, custom chevron arrow via background-image SVG, `appearance:none`.
