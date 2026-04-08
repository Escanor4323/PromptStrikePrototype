<script>
	import ActiveProjectBanner from '$lib/components/ActiveProjectBanner.svelte';
	import AttackSubNav from '$lib/components/AttackSubNav.svelte';
	import { activeProject } from '$lib/stores/projects.js';

	let { children } = $props();
</script>

<ActiveProjectBanner />

<div class="px-8 py-6 pb-0 shrink-0 border-b border-slate-800/50">
	<header class="flex justify-between items-end">
		<div class="mb-2">
			<h1 class="text-3xl font-bold text-slate-100 tracking-tight">Attack Operations</h1>
			{#if $activeProject}
				<p class="text-cyan-400 mt-1 font-mono text-xs uppercase tracking-widest"><span class="text-slate-500">Target Space:</span> {$activeProject.name}</p>
			{/if}
		</div>
		
		{#if $activeProject}
			<AttackSubNav />
		{/if}
	</header>
</div>

<!-- Render sub-pages -->
<div class="flex-1 flex flex-col overflow-hidden">
	{@render children()}
</div>
