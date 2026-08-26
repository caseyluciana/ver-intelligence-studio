# VER Intelligence Hub — Project Context

## What this project is
A static multi-page web app called the **VER Intelligence Hub** (Vendor Engagement & Reliability Intelligence Hub). It is a FY27 portfolio command center for DET vendor intelligence, renewals, governance, and TCO actions.

## Pages
- `index.html` — operating hub overview (home)
- `page_exec.html` — executive snapshot with engagement modals
- `page_renewal.html` — renewal horizon with filter behavior
- `page_governance.html` — governance queue with modal detail
- `page_tco.html` — TCO calculator, accepts pre-populated query parameters from the hub

## Key assets
- `assets/data.js` — data layer
- `assets/styles.css` — all styles
- `assets/app.js` — main application logic

## Architecture notes
- Pure static HTML/CSS/JS — no build step, no framework, no bundler
- Scripts loaded with `defer` on the `<body data-page="...">` element
- Modals rendered into `#modal-root`
- Navigation uses `data-nav` attributes

## Known issues resolved in this build
- Renewal filter buttons were throwing `undefined.classList` — fixed with event delegation
- Executive page had scroll issues
- Modal info tiles were misaligned — now two-column layout on desktop, scroll inside viewport
