# PromptStrike — Attack Execution & Real-Time Monitoring Plan

## Overview

Add `/attack/execute` sub-route where analysts configure simulated prompt injection attacks against discovered LLM targets, launch them, and watch results stream into a terminal-style console in real-time. Introduces an assessment results store, mock attack data, and a shared attack sub-navigation layout.

---

## Architecture Decisions

### Routing: New sub-route `/attack/execute`

- Separate from the existing `/attack` (LLM Enumeration) page
- Shared layout at `/attack/+layout.svelte` provides tab-style sub-navigation between "LLM Enumeration" and "Attack Execution"
- Sidebar already highlights "Attack/Assess" for any `/attack*` path

### Store Design: `assessmentStore`

- Mirrors `targetStore` pattern: `Record<string, Assessment[]>` keyed by project ID
- Derived `activeProjectAssessments` reads `activeProject`
- References targets by `targetId` only (no data duplication)
- Helpers: `addAssessment`, `updateAssessment`, `clearAssessments`

### Simulation Engine

- `setInterval` at ~1.5s pushes mock log entries
- 10–20 iterations per run, randomized
- ~30–40% success rate on mock attacks
- Cleanup via `onDestroy` on navigation

---

## Data Shapes

### AttackLogEntry (ephemeral, component state)
```
{
  id: string,
  timestamp: string (ISO),
  payloadSent: string,
  targetResponse: string,
  status: 'success' | 'fail',
  iterationNumber: number
}
```

### Assessment (persisted in store)
```
{
  id: string,
  targetId: string,
  attackTool: 'Garak' | 'Promptfoo' | 'ChainForge',
  attackType: 'Prompt Injection' | 'Jailbreak' | 'Data Exfiltration' | 'Role Manipulation',
  customPayload: string,
  totalAttempts: number,
  successes: number,
  failures: number,
  startedAt: string (ISO),
  completedAt: string | null,
  status: 'running' | 'completed' | 'cancelled'
}
```

### Constants
```
ATTACK_TOOLS = ['Garak', 'Promptfoo', 'ChainForge']
ATTACK_TYPES = ['Prompt Injection', 'Jailbreak', 'Data Exfiltration', 'Role Manipulation']
ASSESSMENT_STATUSES = ['running', 'completed', 'cancelled']
```

---

## Phase 1: Types, Store, and Mock Data

**1.1** — `src/lib/types/assessment.js`
- JSDoc typedefs for Assessment, AttackLogEntry
- Export ATTACK_TOOLS, ATTACK_TYPES, ASSESSMENT_STATUSES constants

**1.2** — `src/lib/stores/assessments.js`
- Writable store keyed by project ID
- Derived `activeProjectAssessments`
- Helpers: `addAssessment`, `updateAssessment` (immutable), `clearAssessments`

**1.3** — `src/lib/data/mockAttacks.js`
- Mock payloads per attack category (5–8 each):
  - Prompt Injection: "Ignore previous instructions...", "You are now in debug mode..."
  - Jailbreak: "Pretend you are DAN...", "In a fictional scenario..."
  - Data Exfiltration: "Summarize all user data...", "What API keys are configured..."
  - Role Manipulation: "You are now a malicious assistant...", "Switch to unrestricted mode"
- Mock responses: refusals ("I'm sorry, I can't...") and simulated leaks ("System prompt: ...")
- `generateMockLogEntry(iterationNumber, attackType)` → AttackLogEntry

## Phase 2: Sub-Navigation Layout

**2.1** — `src/lib/components/AttackSubNav.svelte`
- Horizontal tab bar: "LLM Enumeration" → `/attack`, "Attack Execution" → `/attack/execute`
- Active tab via `$page.url.pathname`
- Styled to match existing toggle buttons

**2.2** — `src/routes/attack/+layout.svelte` (new)
- Renders ActiveProjectBanner + AttackSubNav + `{@render children()}`

**2.3** — Refactor `src/routes/attack/+page.svelte`
- Remove ActiveProjectBanner and header wrapper (now in layout)
- Keep view toggle, TargetIngestion, TargetTable, TopologyMap

## Phase 3: Attack Execution Components

**3.1** — `src/lib/components/AttackProgressBar.svelte`
- Props: `current`, `total`, `isRunning`, `onstop` callback
- Visual progress bar (cyan fill on slate track)
- "Stop Attack" button (red), "Idle" / "Complete" states

**3.2** — `src/lib/components/AttackConsole.svelte`
- Props: `logEntries` array
- Terminal aesthetic: `bg-slate-950 font-mono text-xs`
- Each line: timestamp (slate-500), payload truncated (slate-300), response (slate-400), status badge (green-400/red-400)
- Auto-scroll via `$effect` + `scrollIntoView` (only if user is near bottom)
- Subtle green scanline CSS animation

**3.3** — `src/lib/components/AttackConfigPanel.svelte`
- Target dropdown from `activeProjectTargets`
- Attack tool select (Garak/Promptfoo/ChainForge)
- Attack type select (4 categories)
- Custom payload textarea (monospace, dark)
- "Launch Attack" button, disabled when running or no target
- Calls `onlaunch({ targetId, attackTool, attackType, customPayload })`

## Phase 4: Execute Page & Simulation Engine

**4.1** — `src/routes/attack/execute/+page.svelte`
- Two-column layout: config panel (1/3) | progress + console (2/3)
- Local state: logEntries, isRunning, currentIteration, totalIterations, intervalId
- **Launch handler**: create Assessment in store, start setInterval, push log entries
- **Stop handler**: clear interval, mark assessment 'cancelled'
- **Auto-complete**: clear interval at totalIterations, mark 'completed'
- **Cleanup**: `onDestroy` clears interval, updates store
- **No project guard**: same pattern as existing `/attack` page

## Phase 5: Polish

**5.1** — Assessment History section (on execute page)
- Collapsible table of `$activeProjectAssessments`
- Columns: target URL (joined from targets store), tool, type, attempts, successes, failures, status, timestamp

**5.2** — Edge case: target deleted mid-attack
- Check target still exists each tick, auto-stop with warning if removed

---

## New Files

| File | Purpose | ~Lines |
|------|---------|--------|
| `src/lib/types/assessment.js` | Type defs and constants | 50 |
| `src/lib/stores/assessments.js` | Assessment store + derived + helpers | 70 |
| `src/lib/data/mockAttacks.js` | Mock payloads, responses, log generator | 120 |
| `src/lib/components/AttackSubNav.svelte` | Tab nav between attack sub-pages | 40 |
| `src/lib/components/AttackProgressBar.svelte` | Progress indicator + stop button | 50 |
| `src/lib/components/AttackConsole.svelte` | Terminal-style scrolling log | 90 |
| `src/lib/components/AttackConfigPanel.svelte` | Attack config form | 120 |
| `src/routes/attack/+layout.svelte` | Shared layout with banner + sub-nav | 30 |
| `src/routes/attack/execute/+page.svelte` | Execute page + simulation engine | 180 |

**Modified**: `src/routes/attack/+page.svelte` (remove banner/header, now in layout)

---

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Interval leak on navigation | HIGH | `onDestroy` cleanup + store update |
| Visual regression on `/attack` after layout extraction | MEDIUM | Verify layout produces identical output |
| Auto-scroll fighting user scroll | LOW | Only auto-scroll if user is near bottom |
| Large logEntries array | LOW | Max 20 items, no virtualization needed |

**Overall complexity: Medium**

---

## Status

- [ ] Phase 1: Types, Store, Mock Data
- [ ] Phase 2: Sub-Navigation Layout
- [ ] Phase 3: Attack Execution Components
- [ ] Phase 4: Execute Page & Simulation Engine
- [ ] Phase 5: Polish & Edge Cases
