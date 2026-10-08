---
name: SOW Cost Estimator
description: Standalone SOW cost estimator tool; light warm off-white theme; PDF/DOCX upload with zero-CDN parsing and role auto-suggest
type: project
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
`sow_estimator.html` is a fully standalone SOW cost estimator tool.

**Features:**
- Warm off-white light theme (#faf9f7 bg, white cards, violet accents)
- 58+ roles across 9 categories with Lo/Mid/Hi benchmark rates
- Level multipliers (Entry/Mid/Senior/Lead/Principal) and region multipliers (AMER/EMEA/APAC/LATAM)
- Editable rate overrides per row
- Fees section: PM fee, T&E, vendor margin (all % of labor), contingency locked per scenario (5/10/15%)
- Generates LOW/MID/HIGH scenario cards with clickable detail modals
- Modal: full line-item breakdown, print, download as clean HTML (built via DOM to avoid parser issues)
- Document upload: label+for pattern (no JS click), PDF and DOCX parsed zero-CDN in-browser
- PDF: raw byte extraction via regex replace+callback on BT stream operators
- DOCX: ZIP walker + DecompressionStream inflate + XML tag strip
- Role keyword matcher surfaces top 8 suggestions with one-click Add Role buttons

**Key lesson — HTML tags in JS strings:**
Any literal `</style>`, `</head>`, `</body>`, `</html>`, `</script>` inside a `<script>` block
will be parsed by the browser as real closing tags, truncating the script and killing all event
listeners. Fix: build HTML output via `createHTMLDocument` + DOM, never string concatenation.

**Why:** Discovered when download function's string-built HTML template silently ended the script block, breaking every button on the page.

**How to apply:** Any future tool that generates downloadable HTML must use DOM construction, not string templates with literal closing tags.
