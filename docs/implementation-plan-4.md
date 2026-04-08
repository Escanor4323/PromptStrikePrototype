# PromptStrike — Reporting Dashboard & Analytics Plan

## Overview

Replace the `/reports` placeholder with a full reporting dashboard that aggregates assessment data for the active project. Displays project metadata, visual metrics via pure CSS/SVG charts, a vulnerability report table of successful exploits, print-optimized styles, and an export button. No external charting libraries.

---

## Architecture Decisions

### Data Aggregation

- New `attackLogStore` keyed by assessment ID to persist individual log entries (payload text, response, status)
- Pure utility functions in `reportMetrics.js` compute chart-ready data from stores
- Mock seed data ensures reports page has data on first load without running attacks

### SVG Chart Approach

- **Donut chart**: Two `<circle>` elements with `stroke-dasharray`/`stroke-dashoffset` for arc segments (success=cyan, failure=red)
- **Bar chart**: Horizontal stacked `<rect>` elements, one row per target, successes + failures side by side
- Both use `viewBox` for responsive scaling, explicit width/height for print

### Print Strategy

- `@media print` in `app.css` overrides dark → light
- Hide sidebar, nav, interactive buttons
- Preserve chart SVG colors (they convey meaning)
- Page breaks between sections
- Remove `h-screen`/`overflow-hidden` constraints

---

## Data Shapes

### AttackLogEntry (persisted in attackLogStore, keyed by assessment ID)
```
{
  id, timestamp, payloadSent, targetResponse,
  status: 'success' | 'fail', iterationNumber
}
```

### Report Metrics (computed, not stored)
```
summaryMetrics: { totalLlmsAssessed, totalAttacks, totalSuccesses, totalFailures }
perTargetBreakdown: [{ targetUrl, llmType, successes, failures, total }]
vulnerabilityRows: [{ targetUrl, llmType, attackTool, attackType, payload, timestamp }]
```

---

## Phase 1: Mock Data Seeding

**1.1** — `src/lib/stores/attackLogs.js`
- Writable store: `Record<assessmentId, AttackLogEntry[]>`
- Helper: `addLogEntries(assessmentId, entries)`

**1.2** — `src/lib/data/mockReportData.js`
- `seedReportData()` populates `assessmentStore` with 5–8 completed assessments for `proj-1001`
- Populates `attackLogStore` with 3–5 log entries per assessment (mix success/fail)
- Uses existing mock target IDs and `generateMockLogEntry()`

**1.3** — Modify `src/routes/+layout.svelte`
- Import and call `seedReportData()` once on mount (with idempotency guard)

## Phase 2: Report Metrics Computation

**2.1** — `src/lib/utils/reportMetrics.js`
- `computeSummaryMetrics(assessments)` → summary counts
- `computePerTargetBreakdown(assessments, targets)` → bar chart data
- `computeVulnerabilityRows(assessments, targets, logStore)` → successful payloads only

## Phase 3: SVG Chart Components

**3.1** — `src/lib/components/charts/DonutChart.svelte`
- Props: `{ successes, failures }`
- SVG `viewBox="0 0 120 120"`, two circles with `stroke-dasharray`
- Center text: success percentage
- Edge case: 0 total → grey donut

**3.2** — `src/lib/components/charts/BarChart.svelte`
- Props: `{ data: [{ label, successes, failures }] }`
- Horizontal stacked bars with cyan (success) and red (failure) segments
- Labels (truncated URLs) on left, counts on right
- Dynamic viewBox height based on data length

## Phase 4: Reports Page

**4.1** — Rewrite `src/routes/reports/+page.svelte`
- **No-project guard**: empty state if no `$activeProject`
- **No-data guard**: empty state if no assessments ("Run attacks first")
- **Report Header**: timestamp, project name, type badge, dates, analyst
- **Summary metrics**: 4 stat cards (Total LLMs, Total Attacks, Successes, Failures)
- **Charts section**: two-column — DonutChart (left) + BarChart (right)
- **Vulnerability Table**: successful payloads only, sortable columns (target URL, LLM type, tool, type, payload, timestamp)
- **Export button**: calls `window.print()`, hidden in print via `print:hidden`
- Root element class: `print-report`

## Phase 5: Print Styles

**5.1** — Append to `src/app.css`
- `@media print` block:
  - `body`: white bg, black text, `overflow: visible`
  - `aside`: `display: none`
  - `.print\\:hidden`: `display: none`
  - `.print-report`: white backgrounds, dark text, thin borders
  - SVG colors preserved
  - `break-before: page` on vulnerability table
  - Remove shadows, hover effects, animations

---

## New Files

| File | Purpose | ~Lines |
|------|---------|--------|
| `src/lib/stores/attackLogs.js` | Log entries store keyed by assessment ID | 40 |
| `src/lib/data/mockReportData.js` | Seed assessments + logs for demo | 80 |
| `src/lib/utils/reportMetrics.js` | Aggregation functions for chart data | 70 |
| `src/lib/components/charts/DonutChart.svelte` | SVG donut chart | 60 |
| `src/lib/components/charts/BarChart.svelte` | SVG horizontal bar chart | 80 |

## Modified Files

| File | Change |
|------|--------|
| `src/routes/reports/+page.svelte` | Complete rewrite to reporting dashboard |
| `src/routes/+layout.svelte` | Add mock data seeding call |
| `src/app.css` | Add `@media print` block |

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Reports page has no data without seeding | HIGH | Mock data seeding in Phase 1 + empty state UI |
| AttackLogEntry payloads are ephemeral | HIGH | `attackLogStore` persists them; seed with mock data |
| SVG charts don't scale in print | MEDIUM | Explicit width/height attrs, not just CSS; test in Chrome print preview |
| Dark-to-light print inversion misses elements | MEDIUM | Broad selectors within `.print-report`, SVG colors preserved |
| Reports page exceeds 400 lines | LOW | Charts extracted to components, metrics to utility |

**Overall complexity: Medium**

---

## Status

- [ ] Phase 1: Mock Data Seeding
- [ ] Phase 2: Report Metrics Computation
- [ ] Phase 3: SVG Chart Components
- [ ] Phase 4: Reports Page
- [ ] Phase 5: Print Styles
