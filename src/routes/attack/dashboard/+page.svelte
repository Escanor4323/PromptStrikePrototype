<script>
	import { activeProjectTargets } from '$lib/stores/targets.js';
	import { activeProjectAssessments } from '$lib/stores/assessments.js';
	import { activeProject } from '$lib/stores/projects.js';
	import DashboardTargetCard from '$lib/components/DashboardTargetCard.svelte';

	let totalVulnerable = $derived(
		$activeProjectTargets.filter(t =>
			$activeProjectAssessments.some(a => a.targetId === t.id && a.successes > 0)
		).length
	);
	let assessed = $derived(
		$activeProjectTargets.filter(t =>
			$activeProjectAssessments.some(a => a.targetId === t.id && a.status === 'completed')
		).length
	);
</script>

<svelte:head>
	<title>Dashboard | PromptStrike</title>
</svelte:head>

<div class="flex-1 overflow-auto px-8 py-8">
	{#if !$activeProject}
		<div class="flex-1 flex items-center justify-center h-full">
			<div class="text-center bg-slate-900/50 p-12 rounded-xl border border-dashed border-slate-700 max-w-lg">
				<h2 class="text-lg font-bold text-slate-300">No Active Project</h2>
				<p class="text-slate-500 mt-2 text-sm">Select a project from the Projects panel to view its dashboard.</p>
			</div>
		</div>
	{:else}
		<div class="mb-6">
			<h1 class="text-2xl font-bold text-slate-100 tracking-tight">Attack Dashboard</h1>
			<p class="text-slate-400 mt-1 text-sm">Overview of all targets for <span class="text-cyan-400 font-mono">{$activeProject.projectName}</span></p>
		</div>

		<!-- Summary metrics -->
		<div class="grid grid-cols-3 gap-4 mb-8">
			<div class="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center">
				<p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Total Targets</p>
				<p class="text-3xl font-bold font-mono text-slate-200">{$activeProjectTargets.length}</p>
			</div>
			<div class="bg-slate-900 border border-cyan-900/40 rounded-xl p-5 text-center">
				<p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Assessed</p>
				<p class="text-3xl font-bold font-mono text-cyan-400">{assessed}</p>
			</div>
			<div class="bg-slate-900 border border-red-900/40 rounded-xl p-5 text-center">
				<p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Vulnerable</p>
				<p class="text-3xl font-bold font-mono text-red-500">{totalVulnerable}</p>
			</div>
		</div>

		{#if $activeProjectTargets.length === 0}
			<div class="text-center bg-slate-900/50 p-12 rounded-xl border border-dashed border-slate-700">
				<svg class="w-14 h-14 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
				</svg>
				<h2 class="text-lg font-bold text-slate-300">No Targets Enumerated</h2>
				<p class="text-slate-500 mt-2 text-sm">Go to Target Enumeration to discover and add targets first.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
				{#each $activeProjectTargets as target (target.id)}
					<DashboardTargetCard {target} assessments={$activeProjectAssessments} />
				{/each}
			</div>
		{/if}
	{/if}
</div>
