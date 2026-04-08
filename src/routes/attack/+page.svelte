<script>
	import TargetIngestion from '$lib/components/TargetIngestion.svelte';
	import TargetTable from '$lib/components/TargetTable.svelte';
	import TopologyMap from '$lib/components/TopologyMap.svelte';
	import WorkflowNextBar from '$lib/components/ui/WorkflowNextBar.svelte';
	import { activeProject } from '$lib/stores/projects.js';
	import { activeProjectTargets } from '$lib/stores/targets.js';
	import { goto } from '$app/navigation';

	let viewMode = $state('table'); // 'table' | 'topology'
</script>

<svelte:head>
	<title>LLM Enumeration | PromptStrike</title>
</svelte:head>

<div class="flex-1 overflow-auto px-8 py-8 flex flex-col">
	{#if !$activeProject}
		<div class="flex-1 flex items-center justify-center">
			<div class="text-center bg-slate-900/50 p-12 rounded-xl border border-dashed border-slate-700 w-full max-w-lg shadow-lg">
				<svg class="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
				</svg>
				<h2 class="text-lg font-bold tracking-tight text-slate-300">No Target Space Selected</h2>
				<p class="text-slate-500 mt-2 text-sm leading-relaxed">Select an active assessment from the Projects panel to begin enumeration.</p>
			</div>
		</div>
	{:else}
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-xl font-bold text-slate-200">Enumeration Profile</h2>
			<div class="flex bg-slate-900 border border-slate-700/60 p-1 rounded-lg">
				<button 
					class="px-4 py-1.5 text-sm font-medium rounded-md transition-all {viewMode === 'table' ? 'bg-slate-800 text-cyan-400 shadow-md border border-slate-700/50' : 'text-slate-400 hover:text-slate-200 border border-transparent'}"
					onclick={() => viewMode = 'table'}
				>
					Data Table
				</button>
				<button 
					class="px-4 py-1.5 text-sm font-medium rounded-md transition-all {viewMode === 'topology' ? 'bg-slate-800 text-cyan-400 shadow-md border border-slate-700/50' : 'text-slate-400 hover:text-slate-200 border border-transparent'}"
					onclick={() => viewMode = 'topology'}
				>
					Topology Map
				</button>
			</div>
		</div>

		<TargetIngestion />

		<div class="flex-1 w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
			{#if viewMode === 'table'}
				<TargetTable />
			{:else}
				<div class="w-full max-w-5xl mx-auto">
					<TopologyMap />
				</div>
			{/if}
		</div>

		<WorkflowNextBar 
			show={$activeProjectTargets.length > 0} 
			label="Continue to Attack Execution" 
			onclick={() => goto('/attack/execute')} 
		/>
	{/if}
</div>
