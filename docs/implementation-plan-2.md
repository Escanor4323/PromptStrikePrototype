# PromptStrike — LLM Enumeration & Topological Map Plan

## Overview

Add LLM target enumeration to the Attack/Assess section. Analysts ingest endpoints via CSV or manual entry, view them in a sortable data table, and visualize them as an SVG network topology — all mocked client-side.

---

## Architecture Decisions

### Store Design
- **New store** `src/lib/stores/targets.js` keyed by project ID (`{ [projectId]: Target[] }`)
- **Derived store** `activeProjectTargets` reacts to `activeProject` changes
- Keeps project store clean; targets are a separate domain concept

### Target Data Shape
```
Target {
  id: string
  endpointUrl: string
  detectedType: 'ChatGPT' | 'Claude' | 'Llama 3' | 'Gemini' | 'Unknown'
  status: 'Online' | 'Offline' | 'Unknown'
  discoveredAt: string (ISO date)
}
```

### SVG Topology Approach
- Deterministic clustered radial layout — no external graph libraries
- Nodes grouped by `detectedType`, clusters arranged in a circle around center hub
- Intra-cluster nodes on smaller sub-circles
- Connection lines between same-type nodes (low opacity)
- ViewBox fixed at `0 0 800 600`, scales responsively
- For 20+ nodes: viewBox expands, hub-and-spoke replaces full mesh within large clusters

---

## Phase 1: Data Layer

**Step 1.1** — `src/lib/types/target.js`
- JSDoc typedef for Target
- Export `LLM_TYPES` and `TARGET_STATUSES` constants

**Step 1.2** — `src/lib/data/mockTargets.js`
- `URL_TO_LLM_MAP`: substring → LLM type (openai→ChatGPT, anthropic→Claude, meta/llama→Llama 3, google/gemini→Gemini)
- `detectLlmType(url)` function
- `simulateDiscovery(urls)` → Target[] with randomized status
- `MOCK_SEED_TARGETS` array (10–15 pre-built targets)

**Step 1.3** — `src/lib/stores/targets.js`
- Writable store: `{ [projectId]: Target[] }`
- Helpers (immutable): `addTargets(projectId, targets)`, `removeTarget(projectId, targetId)`, `clearTargets(projectId)`
- Derived store: `activeProjectTargets`

## Phase 2: Ingestion Component

**Step 2.1** — `src/lib/utils/csvParser.js`
- `parseEndpointCsv(csvText)` → `{ urls: string[], errors: string[] }`
- Split by newline, trim, skip header if contains "url", validate http(s)

**Step 2.2** — `src/lib/components/TargetIngestion.svelte`
- Two sections: CSV Upload (drag-drop + file input) and Manual URL Entry
- On submit: parse → `simulateDiscovery()` → `addTargets()`
- Fake 1–2s "Discovering..." loading state with pulse animation
- Guard: show message if no active project

## Phase 3: Data Table

**Step 3.1** — `src/lib/components/TargetTable.svelte`
- Columns: Endpoint URL, Detected LLM Type, Status, Date Discovered
- Sortable via column headers (local state, immutable sort)
- Status dots: Online=green, Offline=red, Unknown=yellow
- LLM type colored badges (ChatGPT=blue, Claude=orange, Llama=purple, Gemini=teal)
- Empty state: "No targets discovered yet."

## Phase 4: SVG Topological Map

**Step 4.1** — `src/lib/utils/topologyLayout.js`
- Pure function: `calculateLayout(targets, viewWidth, viewHeight)` → `{ nodes: NodePosition[], edges: Edge[] }`
- Algorithm: group by type → place clusters radially → sub-circle within each cluster → generate intra-cluster edges
- Node radius scales down as total count increases
- Export `TYPE_COLOR_MAP` for consistent colors

**Step 4.2** — `src/lib/components/TopologyMap.svelte`
- `<svg viewBox="0 0 800 600" width="100%">`
- Render edges as `<line>` with low opacity
- Render nodes as `<circle>` with status-colored stroke ring
- Labels: hostname extracted from URL, truncated
- Hover tooltip: `<div>` overlay positioned via mouse coords
- Hover highlight: dim unconnected nodes/edges, thicken connected edges
- Empty state: "Add targets to visualize topology"

## Phase 5: Page Integration

**Step 5.1** — Modify `src/routes/attack/+page.svelte`
- Page header: "LLM Enumeration" + active project name
- `<TargetIngestion />` at top
- Toggle tabs: "Table View" | "Topology View"
- Conditionally render `<TargetTable>` or `<TopologyMap>`
- No active project → "Select a project to begin"

---

## New Files

| File | Purpose |
|------|---------|
| `src/lib/types/target.js` | Target type defs and constants |
| `src/lib/data/mockTargets.js` | URL detection, discovery simulation, seed data |
| `src/lib/stores/targets.js` | Targets store + derived store |
| `src/lib/utils/csvParser.js` | CSV parsing and URL validation |
| `src/lib/utils/topologyLayout.js` | Node/edge position calculation |
| `src/lib/components/TargetIngestion.svelte` | CSV upload + manual entry UI |
| `src/lib/components/TargetTable.svelte` | Sortable data table |
| `src/lib/components/TopologyMap.svelte` | SVG network topology |

**Modified**: `src/routes/attack/+page.svelte`

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| SVG clutter with 20+ nodes | Medium | Dynamic viewBox, hub-and-spoke for large clusters, reduced node radius |
| Tooltip positioning in SVG | Medium | Use `<div>` overlay via mouse coords, not `<foreignObject>` |
| CSV parsing edge cases | Low | Simple parser; data is mocked |
| Drag-drop cross-browser | Low | Standard events + click-to-upload fallback |
| Hover performance with many edges | Low | CSS opacity transitions are GPU-accelerated |

**Overall complexity: Medium**

---

## Status

- [ ] Phase 1: Data Layer
- [ ] Phase 2: Ingestion Component
- [ ] Phase 3: Data Table
- [ ] Phase 4: SVG Topological Map
- [ ] Phase 5: Page Integration
