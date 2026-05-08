<script>
	import ProjectList from '$lib/components/ProjectList.svelte';
	import ActiveProjectBanner from '$lib/components/ActiveProjectBanner.svelte';
	import CreateProjectModal from '$lib/components/CreateProjectModal.svelte';
	import TacticalButton from '$lib/components/ui/TacticalButton.svelte';
	import WorkflowNextBar from '$lib/components/ui/WorkflowNextBar.svelte';
	import TargetIngestion from '$lib/components/TargetIngestion.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { projectList, activeProject, addProject } from '$lib/stores/projects.js';
	import { targetStore, addTargets } from '$lib/stores/targets.js';
	import { assessmentStore, addAssessment } from '$lib/stores/assessments.js';
	import { attackLogStore, addLogEntries } from '$lib/stores/attackLogs.js';
	import { get } from 'svelte/store';

	let isModalOpen = $state(false);

	function handleExport() {
		const projects = get(projectList);
		const targets = get(targetStore);
		const assessments = get(assessmentStore);
		const logs = get(attackLogStore);
		const blob = new Blob([JSON.stringify({ projects, targets, assessments, logs }, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `promptstrike-projects-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}

	/** @param {Event} e */
	function handleImport(e) {
		const input = /** @type {HTMLInputElement} */ (e.currentTarget);
		const file = input.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				const data = JSON.parse(/** @type {string} */ (ev.target?.result));
				if (data.projects) {
					data.projects.forEach((/** @type {import('$lib/types/project.js').Project} */ p) => addProject({ ...p }));
				}
				if (data.targets) {
					Object.entries(data.targets).forEach(([pid, tgts]) => {
						addTargets(pid, /** @type {import('$lib/types/target.js').Target[]} */ (tgts));
					});
				}
				if (data.assessments) {
					Object.entries(data.assessments).forEach(([pid, asmts]) => {
						/** @type {import('$lib/types/assessment.js').Assessment[]} */ (asmts).forEach(a => addAssessment(pid, a));
					});
				}
				if (data.logs) {
					Object.entries(data.logs).forEach(([asmtId, entries]) => {
						addLogEntries(asmtId, /** @type {import('$lib/types/assessment.js').AttackLogEntry[]} */ (entries));
					});
				}
			} catch {
				console.error('Import failed: invalid JSON');
			}
		};
		reader.readAsText(file);
		input.value = '';
	}
</script>

<svelte:head>
	<title>Projects | PromptStrike</title>
</svelte:head>

<ActiveProjectBanner />

<div class="p-8 pb-0 shrink-0">
	<header class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold text-slate-100 tracking-tight">Manage Projects</h1>
			<p class="text-slate-400 mt-1">Create, manage, and import assessment projects.</p>
		</div>
		<div class="flex items-center gap-2">
			<label class="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg cursor-pointer transition-colors">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
				</svg>
				Import
				<input type="file" accept=".json" class="hidden" onchange={handleImport} />
			</label>
			<button
				class="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
				onclick={handleExport}
			>
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
				</svg>
				Export
			</button>
			<TacticalButton 
				icon='<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />' 
				onclick={() => isModalOpen = true}
			>
				New Project
			</TacticalButton>
		</div>
	</header>
</div>

<div class="flex-1 overflow-auto p-8 pt-0">
	{#if $activeProject}
		<details class="mb-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
			<summary class="px-5 py-3 text-sm font-bold text-slate-300 cursor-pointer hover:text-white list-none flex items-center gap-2">
				<svg class="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				Load Target URLs for <span class="text-cyan-400 ml-1">{$activeProject.projectName}</span>
			</summary>
			<div class="p-5 border-t border-slate-800">
				<TargetIngestion />
			</div>
		</details>
	{/if}
	<ProjectList />
</div>

<WorkflowNextBar 
	show={$activeProject !== null} 
	label="Continue to Enumeration" 
	onclick={() => goto(`${base}/attack`)}
/>

{#if isModalOpen}
	<CreateProjectModal onClose={() => isModalOpen = false} />
{/if}
