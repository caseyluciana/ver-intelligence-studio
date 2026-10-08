---
name: Preferred Suppliers — AMER
description: Confirmed Tier 1 preferred suppliers for AMER with their actual service categories
type: project
originSessionId: fdd71aed-24d9-4dce-8cca-ec3bc3933c8e
---
These are the real preferred suppliers for AMER. Use to validate/correct vendor data in the platform.

| Vendor | Service Categories |
|--------|-------------------|
| PwC | General Consulting, Security Compliance Testing, SOX, ERP Finance |
| Deloitte | HR Consulting, Payroll Advisory, Tax, Data, M&A |
| Accenture | System Integration - Finance, General Mgmt Consulting |
| Slalom | General Consulting, Data, Software Dev |
| Cognizant | BPO for Sales, RevOps; MSP for Workday |
| KPMG | Tax & Accounting Consulting |
| Capgemini | Product Development, Security/Data Analytics |
| Coalfire | Security & Certification Consulting |
| Fractal | Data Analytics - DET |
| Globant | Software Dev in LATAM |
| Ernst & Young | Statutory External Audit, Security / Tax Compliance |
| NTT Data | MSP for DET Application Maintenance |
| Strada | Payroll - US/Canada |
| ADP | Payroll - International |
| NCC Group | Security Assurance / PenTesting |
| HackerOne | Security Bug Bounty Program |

**Why:** These are real Salesforce DET vendor relationships — use to populate accurate category, capability, and description fields in vendor_detail.html and vendors.js rather than placeholder data.

**How to apply:** Tomorrow — cross-reference these against the existing vendor records in vendors.js, correct any mismatched categories or descriptions, and ensure all 16 appear as Tier 1 in AMER with accurate service lines. These should be the 8 shown on vendor_home.html's Tier 1 partners grid (currently capped at 8 — may need to expand or prioritize top 8 by spend).
