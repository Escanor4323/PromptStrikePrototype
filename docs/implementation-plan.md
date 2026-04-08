# PromptStrike Frontend Prototype — Implementation Plan

## Overview

Greenfield SvelteKit application for "PromptStrike" — an LLM vulnerability testing platform for cybersecurity operations. Fully offline, dark tactical aesthetic, static mock data, no backend.

---

## Phase 1: Scaffolding

- `npx sv create .` (Svelte 5, JS, skeleton template)
- Install Tailwind CSS v4 via `@tailwindcss/vite`
- Install `@sveltejs/adapter-static` for offline use
- Configure dark-mode base styles (slate-900 bg, cyan/emerald accents)
- Verify: app loads with dark background, no external network requests

## Phase 2: Layout & Sidebar Navigation

- Persistent `Sidebar.svelte` component with nav links: Projects, Attack/Assess, Reports
- Root `+layout.svelte` with sidebar + slot (flex layout)
- Placeholder pages for `/projects`, `/attack`, `/reports`
- Active link highlighting via `$page.url.pathname`
- Inline SVG icons, "PromptStrike" branding at top of sidebar

## Phase 3: Mock Data & Svelte Stores

- JSDoc `@typedef` for Project: `{ id, name, type ('CVI'|'CVPA'), startDate, endDate, analystInitials, createdAt }`
- 5–8 mock projects with realistic cybersecurity assessment names
- Writable stores: `projectList`, `activeProject`
- Immutable helper functions: `addProject()`, `setActiveProject()`, `clearActiveProject()`

## Phase 4: Project List View

- `ProjectCard.svelte` — name, type badge (CVI=cyan, CVPA=emerald), dates, analyst initials
- `ProjectList.svelte` — responsive grid of cards, header with "New Project" button
- `ActiveProjectBanner.svelte` — slim banner showing selected project, "Clear" button
- Wire into `/projects` route and root layout

## Phase 5: Create Project Modal

- Modal form fields: Name of Assessment, Type (CVI/CVPA dropdown), Start Date, End Date, Analyst Initials
- Inline validation: required fields, end date >= start date, initials 2–4 uppercase chars
- On submit: generate ID, call `addProject()`, close modal
- Reactive update — new project appears immediately in list

---

## File Structure

```
src/
├── app.html
├── app.css
├── lib/
│   ├── stores/
│   │   └── projects.js
│   ├── data/
│   │   └── mockProjects.js
│   ├── types/
│   │   └── project.js
│   └── components/
│       ├── Sidebar.svelte
│       ├── ProjectCard.svelte
│       ├── ProjectList.svelte
│       ├── CreateProjectModal.svelte
│       └── ActiveProjectBanner.svelte
└── routes/
    ├── +layout.svelte
    ├── +page.svelte              # redirects to /projects
    ├── projects/
    │   └── +page.svelte
    ├── attack/
    │   └── +page.svelte          # placeholder
    └── reports/
        └── +page.svelte          # placeholder
```

## Dependencies

### Production
- `svelte`, `@sveltejs/kit`, `@sveltejs/adapter-static`

### Dev
- `tailwindcss`, `@tailwindcss/vite`, `vite`

### Constraints
- No CDNs — all assets bundled locally
- No UI component libraries — hand-built with Tailwind
- System font stack (no external font files required)

## Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Tailwind v4 Vite plugin config differs from v3 | Medium | Follow official v4 docs; fall back to v3+PostCSS if needed |
| Svelte 5 runes syntax vs Svelte 4 reactivity | Medium | Confirm scaffolded version; adapt patterns accordingly |
| Modal accessibility (focus trap, escape key) | Medium | Implement keyboard handlers for Escape; trap focus |
| Date validation edge cases | Low | Simple string comparison for mock dates |

**Overall complexity: Low–Medium**

---

## Status

- [ ] Phase 1: Scaffolding
- [ ] Phase 2: Layout & Sidebar
- [ ] Phase 3: Mock Data & Stores
- [ ] Phase 4: Project List View
- [ ] Phase 5: Create Project Modal
