# VER Intelligence Hub — Build Guide & Maintenance Reference

> **Owner:** Carlos Candelaria, VER Team (Salesforce DET)  
> **Last Updated:** July 2026  
> **Tech Stack:** Pure static HTML/CSS/JS — no build step, no framework, no bundler  
> **Deployment:** Served from Google Apps Script or any static file host

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Theme System](#3-theme-system)
4. [Navigation & Routing](#4-navigation--routing)
5. [Page Index](#5-page-index)
   - [Intelligence Hub Pages](#51-intelligence-hub-pages)
   - [Team Portal](#52-team-portal)
   - [Vendor Platform](#53-vendor-platform)
   - [Supplier Portal](#54-supplier-portal)
   - [Standalone Tools](#55-standalone-tools)
   - [Cinematic & Presentation Pages](#56-cinematic--presentation-pages)
   - [Tracker Pages](#57-tracker-pages)
6. [Key Tools Reference](#6-key-tools-reference)
   - [TCO Calculator](#61-tco-calculator)
   - [CQBR Generator](#62-cqbr-generator)
   - [Cinematic Generator v2](#63-cinematic-generator-v2)
   - [Chief of Staff Module](#64-chief-of-staff-module)
7. [Data Layer](#7-data-layer)
8. [Common Patterns](#8-common-patterns)
9. [Light / Dark / Mid Theme Overrides](#9-light--dark--mid-theme-overrides)
10. [Known Quirks & Gotchas](#10-known-quirks--gotchas)
11. [Google Apps Script Deployment](#11-google-apps-script-deployment)
12. [Maintenance Checklist](#12-maintenance-checklist)

---

## 1. Project Overview

The **VER Intelligence Hub** is a multi-page static web application built for the Salesforce DET Vendor Engagement & Reliability (VER) team. It serves as an FY27 command center for vendor intelligence, renewals, governance, TCO analysis, and team operations.

**Audience tiers:**
- **VER Team** — team portal, trackers, CQBR generator, chief of staff
- **Internal Stakeholders** — intel hub pages, exec snapshot, renewal horizon
- **Suppliers / Vendors** — supplier portal (portal_*.html pages)
- **Other Teams** — standalone tools (TCO calculator, spend benchmarking)

**What VER does:** VER serves stakeholders — surfacing intelligence, routing decisions, and delivering analysis so the business can act with confidence. VER does **not** process Change Orders (CO) — remove any CO references if found.

---

## 2. Architecture

```
CW Rate Benchmarks/
├── index.html                    # Hub home / landing
├── page_*.html                   # Hub intel pages
├── portal_*.html                 # Supplier/team portal pages
├── vendor_*.html                 # Vendor platform pages
├── team_portal.html              # VER internal team hub
├── *_tracker.html                # Team tracker pages
├── chief_of_staff.html           # Standalone CoS tool (NOT in portal nav)
├── tco_standalone.html           # Standalone TCO (for external teams)
├── spend_benchmarking.html       # Standalone spend benchmark
├── assets/
│   ├── data.js                   # Shared data layer
│   ├── styles.css                # Global styles (hub pages)
│   ├── app.js                    # Global app logic (hub pages)
│   └── help-modal.js             # Shared help modal utility
└── VER_INTELLIGENCE_HUB_GUIDE.md # This file
```

**Key architectural rules:**
- Every page is fully self-contained — all CSS and JS is inline in the `<style>` and `<script>` tags within each HTML file
- The `assets/` folder is only used by the main hub pages (`page_*.html`, `index.html`)
- Portal, vendor, and tracker pages carry their own inline styles
- No external JS frameworks — plain ES5 JavaScript throughout for broad compatibility
- Google Fonts (Inter) loaded via CDN; all other assets are inline or from trusted CDNs

---

## 3. Theme System

There are **two separate theme systems** depending on which page group you're editing.

### Hub Pages (`page_*.html`, `index.html`)
Uses `data-theme` attribute on `<html>`:
```js
document.documentElement.setAttribute('data-theme', 'dark' | 'light');
localStorage.setItem('ver-theme', theme);
```
CSS variables switch via `[data-theme="dark"] { ... }` blocks.

### Portal & Team Pages (`portal_*.html`, `team_portal.html`, `*_tracker.html`)
Uses CSS classes on `<body>`:
```js
document.body.classList.add('light-mode');    // light
document.body.classList.add('mid-mode');      // mid (default)
// neither class = dark mode
localStorage.setItem('ver-portal-theme', 'light' | 'mid' | 'dark');
```

**Three portal modes:**
| Mode | Body class | Background |
|------|-----------|------------|
| Dark | *(none)* | `#070411` |
| Mid | `mid-mode` | `#0E0B22` |
| Light | `light-mode` | `#FFF0F4` |

**Critical:** When adding light-mode color fixes, always override semantic color variables in the light-mode block:
```css
body.light-mode {
  --green: #059669;
  --amber: #B45309;
  --red: #DC2626;
}
```
This ensures every element using `var(--green)` etc. gets an accessible dark color instead of the neon dark-mode values.

---

## 4. Navigation & Routing

### Hub navigation
Hub pages use `data-nav` attributes and are wired in `assets/app.js`. The sidebar uses `<a href="page_name.html">` relative links.

### Google Apps Script link rewriting
When deployed on Apps Script, all `href="page_name.html"` links are automatically rewritten to `?page=page_name` by the IIFE at the bottom of each file:
```js
(function(){
  var isAppsScript = window.location.href.indexOf('script.google.com') > -1
    || window.location.href.indexOf('googleusercontent.com') > -1;
  if(!isAppsScript) return;
  // rewrites .html links to ?page= params
})();
```
This runs in every page — do not remove it.

### Back bars
Hub-sourced pages have a `.back-bar` at the top linking back to `index.html`. Standalone tools should have the back link removed (see `tco_standalone.html` for the pattern).

---

## 5. Page Index

### 5.1 Intelligence Hub Pages

| File | Title | Purpose |
|------|-------|---------|
| `index.html` | VER Intelligence Hub | Home / operating hub overview |
| `page_exec.html` | Executive Intelligence | C-level snapshot with engagement modals |
| `page_renewal.html` | Renewal Calendar | Contract renewal horizon with filter behavior |
| `page_governance.html` | Governance Posture | Governance queue with modal detail |
| `page_tco.html` | TCO Calculator | Full TCO calculator (hub-connected version) |
| `page_tco_dashboard.html` | TCO Dashboard | Portfolio TCO breakdown across pillars |
| `page_rate_benchmarks.html` | Rate & Benchmark Intelligence | Rate card and benchmark analysis |
| `page_scorecards.html` | Vendor Performance Scorecards | Scorecard dashboards |
| `page_cqbr.html` | CQBR Library | Repository of all generated CQBRs |
| `page_cqbr_generator.html` | CQBR Generator | Generation tool (hub version) |
| `page_category_intel.html` | Category Intelligence | Spend by category |
| `page_cw_intel.html` | Contingent Workforce Intelligence | CW spend tracking |
| `page_consumption.html` | Consumption Monitor | Service consumption analytics |
| `page_digest.html` | Monthly Digest | Intelligence briefing archive |
| `page_decision.html` | Decision Support Center | Decision-making analytics |
| `page_decision_ledger.html` | Decision Ledger | Log of procurement decisions |
| `page_forecast.html` | Cost Optimization & Demand Planning | Forecasting and HC planning |
| `page_market.html` | Market Intelligence | Market trends and competitive analysis |
| `page_spend_analysis.html` | AI-Assisted Spend Analysis | AI-powered spend analysis |
| `page_ma.html` | M&A Vendor Transition | Merger & acquisition vendor tracking |
| `page_mft.html` | MFT Forecasted Spend | Managed File Transfer spend forecast |
| `page_sow.html` | SOW & PO Expiry Tracker | Statement of Work expiry tracking |
| `page_ai_cost.html` | AI Cost Monitor | AI spending and cost analysis |
| `page_action_queue.html` | Action Queue | Task queue and workflow management |
| `page_pillar.html` | Pillar Portfolio Intelligence | Strategic pillar portfolio view |
| `page_pillar_detail.html` | Pillar Intelligence Detail | Detailed pillar-level analytics |
| `page_pillar_alerts.html` | Pillar Action Alerts | Pillar-specific alerts |
| `page_pillar_pl.html` | Spend & Savings Intelligence | Pillar P&L analysis |
| `page_scenario.html` | Scenario Planner | What-if scenario modeling |
| `page_roadmap.html` | Strategic Roadmap | VER team roadmap and initiatives |
| `page_guide.html` | VER-Ready Manager Guide | Manager enablement documentation |
| `page_team.html` | Our Team | VER team profiles and charter |
| `page_vision_series.html` | Vision Series | Content/video series library |
| `page_survey.html` | Vendor Performance Survey | Survey instrument |
| `page_survey_review.html` | Survey Response Review | Internal survey review |
| `page_coming.html` | Coming Soon | Placeholder for in-development pages |

### 5.2 Team Portal

| File | Title | Purpose |
|------|-------|---------|
| `team_portal.html` | VER Team Portal | Main internal hub; hero tile with Chibi rabbit; Chief of Staff briefing; daily queue; team assignments; tracker links |
| `assignments.html` | Assign Work | Task distribution and work queue |
| `response_tracker.html` | Response Time Tracker | Vendor response SLA tracking |
| `risk_tracker.html` | Risk Assessment Tracker | Risk scoring and tracking |
| `savings_tracker.html` | Savings Tracker | Cost savings attribution |
| `chief_of_staff.html` | Chief of Staff | **Standalone** personal CoS dashboard — NOT wired to portal sidebar nav |

**Team members (real names):**
| ID | Name | Role | Note |
|----|------|------|------|
| carlos | Carlos | VER Lead | Director — can switch profiles |
| debs | Deborah | VER Analyst | Display as "Debs" in UI |
| alex | Alex | VER Analyst | |
| priya | Priya | VER Analyst | |
| jordan | Jordan | VER Coordinator | |

### 5.3 Vendor Platform

| File | Title | Purpose |
|------|-------|---------|
| `vendor_home.html` | Portfolio Overview | Vendor portfolio dashboard |
| `vendor_detail.html` | Vendor Detail | Individual vendor profile + analytics |
| `vendor_registry.html` | Vendor Registry | Master vendor database |
| `vendor_risk.html` | Vendor Risk Assessment | Risk dashboard |
| `vendor_selector.html` | Vendor Selector | Multi-vendor comparison |
| `vendor_sow.html` | Vendor SOW & PO Tracker | SOW and PO management |
| `vendor_intake.html` | Vendor Intake Form | New vendor onboarding form |
| `vendor_co.html` | Vendor Change Orders | Change order management |

### 5.4 Supplier Portal

| File | Title | Purpose |
|------|-------|---------|
| `portal_home.html` | DET Supplier Portal | Main supplier registration and intake |
| `portal_confirm.html` | Submission Received | Post-submission confirmation |
| `portal_rate_benchmarks.html` | Rate Benchmarks Portal | Rate submission interface |
| `portal_vendor_registry.html` | Vendor Registry Portal | Vendor registration |
| `portal_vendor_selector.html` | Vendor Selector Portal | Vendor selection interface |
| `portal_vendor_risk.html` | Vendor Risk Portal | Risk assessment with heat map and detail panel |
| `portal_intake_review.html` | Intake Review | Internal review of submitted intakes |
| `portal_survey.html` | Vendor Survey Portal | Supplier performance survey |
| `portal_survey_review.html` | Survey Response Review | Internal survey analysis |
| `portal_cqbr_generator.html` | CQBR Generator (Portal) | CQBR generation tool in portal context |

### 5.5 Standalone Tools

| File | Title | Purpose | Notes |
|------|-------|---------|-------|
| `tco_standalone.html` | TCO Calculator | Standalone TCO tool for external teams | No hub nav, no back link, no DET/VER branding |
| `spend_benchmarking.html` | Spend Benchmarking | Standalone benchmarking analysis | |

### 5.6 Cinematic & Presentation Pages

| File | Title | Purpose |
|------|-------|---------|
| `page_cinematic_generator_v2.html` | Cinematic Generator v2 | Standalone meeting/presentation builder — NOT in hub nav |
| `Cognizant_QBR_FY26Q4_Cinematic_v2.html` | Cognizant QBR Cinematic | Full-screen exec presentation |
| `VER_Hub_Build_Story.html` | Hub Build Story | Development narrative (standalone) |
| `VER_Manager_Guide.html` | Manager Guide | Standalone manager enablement |
| `VER_Monthly_Digest_May2026.html` | Monthly Digest May 2026 | Archived digest (standalone) |
| `VER_Strategic_Roadmap.html` | Strategic Roadmap | Standalone strategy doc |
| `VER_Team_Charter_Standalone.html` | Team Charter | Standalone team charter |
| `VER_Vision_Series_E1_WhoIsVER_v2.html` | Vision Series E1 | Who Is VER? — Episode 1 |

### 5.7 Tracker Pages

| File | Title | Purpose |
|------|-------|---------|
| `response_tracker.html` | Response Time Tracker | Vendor SLA response tracking |
| `risk_tracker.html` | Risk Assessment Tracker | Risk scoring with band distribution |
| `savings_tracker.html` | Savings Tracker | Savings attribution and targets |

---

## 6. Key Tools Reference

### 6.1 TCO Calculator

**Files:** `page_tco.html` (hub version), `tco_standalone.html` (standalone)

**Engagement types:** Software/SaaS · SOW Engagement · Cloud & Infrastructure · Professional Services · Contingent Workforce · Mobility & Telecom

**Modes:** Decision Support (benchmark estimates) | Audit & Review (actual costs)

**Core functions:**
- `buildCategories()` — renders all input sliders for the selected engagement type
- `getCatTotal(catId)` — calculates a category total from input values (handles hrs/FTE/% special units)
- `get3YrTotal()` — returns year-by-year and total TCO across the contract term
- `getHiddenCostPct()` — calculates what % of total TCO is hidden beyond contracted value
- `openAssessModal()` — generates the full TCO assessment report modal
- `exportPDF()` — print-to-PDF via `window.print()` with `.printing` body class
- `exportCSVSummary()` / `exportCSVFull()` — CSV download via Blob URL

**URL pre-population:** Hub links to the TCO calculator pass `?vendor=NAME&type=TYPE&spend=VALUE&mult=MULT` query params. The `loadFromURL()` function reads these and pre-fills inputs.

**Standalone differences from hub version:**
- No `← VER Intelligence Hub` back link
- No `Portfolio TCO` dashboard link in the top bar
- No hub/DET/FY27 references in stage eyebrow, footer, or assessment modal
- Dashboard panel (pillar grid + engagement grid) still present but accessible only via mode toggle

**Internal rate constants:**
```js
var INTERNAL_RATE = 200; // $ per hour for FTE/hours inputs
var HELPDESK_COST = 25;  // $ per support ticket
```

### 6.2 CQBR Generator

**Files:** `page_cqbr_generator.html` (hub), `portal_cqbr_generator.html` (portal)

Generates Cognizant Quarterly Business Review documents from Excel upload or manual input. Supports multiple meeting types (MBR, QBR, Team, Offsite, Exec).

**Critical note:** The `_toggleTheme` function and its init IIFE must be in a **separate `<script>` block** after the main one. If they are inside the main script block, the HTML parser will terminate the script early when it encounters `</script>` inside a template literal, causing raw JS text to render visibly at the bottom of the page.

```html
</script>  <!-- close main script first -->
<script>
function _toggleTheme(){ ... }
(function(){ /* theme restore IIFE */ })();
</script>
```

### 6.3 Cinematic Generator v2

**File:** `page_cinematic_generator_v2.html`

Standalone tool — **NOT wired to hub nav**. Generates cinematic presentation pages for any meeting type. Use cases: MBR, QBR, team meetings, offsites, exec briefings.

Output: a full-screen animated HTML presentation saved as a standalone file.

### 6.4 Chief of Staff Module

**Two separate implementations:**

1. **Built-in daily briefing** in `team_portal.html` — opens as an overlay modal via `openCoS()`. Auto-shows once per day when a team member logs in. Contains priorities, meeting schedule, and action items from `COS_DATA`.

2. **Standalone CoS** (`chief_of_staff.html`) — personal executive assistant dashboard. **NOT in the portal sidebar navigation.** Accessed directly. Contains personal task management, KPI tracking, and a separate data model.

---

## 7. Data Layer

### Shared data (`assets/data.js`)
Used by hub pages. Contains vendor data, pillar data, renewal timelines, and governance records.

### Inline data (portal/team/tracker pages)
Most portal and team pages carry their own data inline as JS objects or arrays within `<script>` tags. This keeps each page self-contained for deployment.

### Vendor logo CDN
Vendor logos are fetched from Brandfetch CDN:
```js
var BF_CLIENT = '1idLxwmT7Sv6VAWJq9j';
// Usage:
`https://cdn.brandfetch.io/${domain}?c=${BF_CLIENT}`
```

**onerror fallback pattern** — use DOM createElement, not `innerHTML=`, to avoid quote-escaping issues:
```js
onerror="this.style.display='none';
  var s=document.createElement('div');
  s.style.cssText='...';
  s.textContent='A';
  this.parentNode.insertBefore(s,this);"
```

### VENDOR_DOMAINS map
Each portal page that shows logos maintains a `VENDOR_DOMAINS` object mapping vendor name → domain:
```js
var VENDOR_DOMAINS = {
  'Cognizant': 'cognizant.com',
  'IBM': 'ibm.com',
  // ...
};
```

---

## 8. Common Patterns

### KPI Strip
Most pages open with a `.kpi-strip` or `.total-strip` showing key metrics. Values are updated by JS after page load.

### Modal system
Modals use a `.modal-backdrop` + `.modal-box` pattern:
```js
function openModal(id) {
  var bd = document.getElementById(id);
  bd.style.opacity = '1';
  bd.style.pointerEvents = 'all';
  bd.querySelector('.modal-box').style.transform = 'translateY(0) scale(1)';
  document.body.style.overflow = 'hidden';
}
function closeModal(id) { /* reverse */ }
```

### Help modal utility (`assets/help-modal.js`)
Hub pages use a shared help modal:
```js
HelpModal.open({
  title: 'Page Name',
  what: 'What this page does...',
  steps: ['Step 1...', 'Step 2...'],
  tips: [{ icon: '📊', title: 'Tip title', body: 'Tip body' }],
  footNote: 'FY27 · Salesforce DET · Confidential'
});
```

### Sticky header height
The top bar is `52px` tall. The running total strip (TCO calculator) is also `52px`. Sticky elements inside content areas should use `top: 52px` (or `top: 104px` when both bars are present).

### `position:sticky` inside a scroll container
Sticky only works relative to the nearest scrolling ancestor. If an element inside a scrollable `div` needs to be sticky, ensure that `div` has `overflow-y:auto` and the sticky element has an explicit `top` value. Do NOT add sticky to elements inside a non-scrolling container hoping they'll stick to the page.

---

## 9. Light / Dark / Mid Theme Overrides

When fixing visibility issues in light mode on portal/team/tracker pages, follow this pattern:

### 1. Override semantic color variables at the root level
```css
body.light-mode {
  --green: #059669;    /* replaces neon #34D399 */
  --amber: #B45309;    /* replaces neon #FBBF24 */
  --red:   #DC2626;    /* replaces bright #F43F5E */
}
```

### 2. Override component classes
```css
/* Status pills */
body.light-mode .sp-green { background: rgba(5,150,105,0.14); color:#059669; border-color:rgba(5,150,105,0.35); }
body.light-mode .sp-amber { background: rgba(180,83,9,0.12);  color:#B45309; border-color:rgba(180,83,9,0.30); }
body.light-mode .sp-red   { background: rgba(192,20,60,0.12); color:#C0143C; border-color:rgba(192,20,60,0.30); }

/* Bar tracks */
body.light-mode .hbar-track { background: rgba(26,8,24,0.18) !important; }
```

### 3. Override canvas/SVG charts at draw time
For canvas-based charts (radar charts, donuts), detect light mode at draw time:
```js
var isLight = document.body.classList.contains('light-mode');
var gridColor = isLight ? 'rgba(26,8,24,0.15)' : 'rgba(255,255,255,0.15)';
```

---

## 10. Known Quirks & Gotchas

### Script tag inside template literal
**Problem:** The HTML parser terminates a `<script>` block when it encounters `</script>` — even inside a JS string or template literal.  
**Solution:** Close the main script block before any function that contains `</script>` in a string, then open a new `<script>` block for those functions.

### Emoji splitting
**Problem:** `'🐹🐻'.split('')` produces broken characters (question marks) because multi-codepoint emoji are split at the UTF-16 level.  
**Solution:** Use `Array.from()` or avoid splitting emoji strings entirely. Store friends/companions as an array instead of a string:
```js
friends: ['🐹', '🐻']  // array, not string
```

### onerror HTML injection
**Problem:** Inline `onerror="this.parentNode.innerHTML='<div>...'` breaks when the HTML string contains quote characters — the browser parses the first `"` as closing the attribute.  
**Solution:** Use `document.createElement()` in the onerror handler:
```js
onerror="this.style.display='none';var s=document.createElement('div');...this.parentNode.insertBefore(s,this);"
```

### `position:sticky` scope
Sticky is scoped to the nearest scrolling ancestor. A sticky element inside a flex child with `overflow:hidden` will not stick to the viewport.

### Panel height bleeding
When a detail panel should be the same height as the viewport (not the page), use:
```css
.detail-panel {
  height: calc(100vh - 104px); /* 52px topbar + 52px toolbar */
  position: sticky;
  top: 0;
  align-self: flex-start;
}
```
Do NOT use `align-self: stretch` — this extends the panel to match the full page height, causing a white box to appear below content.

### `<script src="assets/help-modal.js">` not available in standalone pages
Standalone and portal pages that do not load `assets/help-modal.js` must not call `HelpModal.open()`. Either inline the help modal content or use a simpler fallback.

---

## 11. Google Apps Script Deployment

All pages include an IIFE at the bottom that detects Apps Script hosting and rewrites `.html` links to `?page=` query parameters:

```js
(function(){
  var isAppsScript = window.location.href.indexOf('script.google.com') > -1
    || window.location.href.indexOf('googleusercontent.com') > -1;
  if(!isAppsScript) return;
  function rewriteLinks(){
    document.querySelectorAll('a[href]').forEach(function(a){
      var href = a.getAttribute('href');
      if(!href || href.startsWith('http') || href.startsWith('#') || !href.match(/\.html/)) return;
      var page = href.replace(/\.html.*$/, '').replace(/^.*\//, '');
      var base = window.location.href.split('?')[0];
      a.setAttribute('href', base + '?page=' + page);
    });
  }
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rewriteLinks);
  } else { rewriteLinks(); }
  new MutationObserver(rewriteLinks).observe(document.body, {childList:true, subtree:true});
})();
```

**Do not remove this IIFE from any page.** It is harmless when running locally.

For the Apps Script host file, each `?page=NAME` request is resolved to the corresponding `NAME.html` file and its content is served.

---

## 12. Maintenance Checklist

### Adding a new hub page
- [ ] Create `page_newname.html` based on an existing page as a template
- [ ] Add the `← VER Intelligence Hub` back bar at the top
- [ ] Include the Apps Script link rewriter IIFE at the bottom of the `<script>` block
- [ ] Add a nav link in `index.html` sidebar
- [ ] Add entry to this guide's page index

### Adding a new portal page
- [ ] Create `portal_newname.html`
- [ ] Include the three-mode theme system (`_toggleTheme` + restore IIFE)
- [ ] Add light-mode overrides for all status pills, bar tracks, and color variables
- [ ] Include the Apps Script link rewriter IIFE
- [ ] Add sidebar link in `team_portal.html` if it's a team tool
- [ ] Add entry to this guide's page index

### Fixing light-mode colors
1. Check if the broken color uses a CSS variable (`var(--amber)` etc.)
2. If yes → add the variable override to the `body.light-mode { }` block
3. If no → add a specific `body.light-mode .classname { }` override

### Updating vendor data
- Hub vendor data: edit `assets/data.js`
- Portal vendor data: search for `VENDOR_DOMAINS` and `VENDORS` arrays within each portal page
- Preferred Tier 1 AMER vendors: Accenture, Cognizant, IBM, Infosys, TCS, Wipro, HCL, Capgemini, NTT Data, DXC, Deloitte, PwC, EY, KPMG, BCG, McKinsey

### Adding a team member
Edit the `TEAM_MEMBERS` array in `team_portal.html`:
```js
{ id: 'newid', name: 'Full Name', role: 'VER Role', emoji: '👤', color: '#HEX', director: false }
```

### Deploying the standalone TCO calculator
Use `tco_standalone.html` — it has all hub/DET references removed and is safe to share with external teams or host in a Forge space. The full calculation engine, AI augmentation panel, CSV/PDF export, and assessment report all work independently.

---

*This document should be updated whenever a new page is added, a key behavior changes, or a non-obvious pattern is established.*
