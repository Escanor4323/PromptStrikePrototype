<script>
	import { page } from '$app/stores';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
</script>

<div class="flex flex-wrap items-center gap-1 bg-slate-900 border-b border-slate-800 p-4 print:hidden w-full">
	<a 
		href="/attack" 
		class="px-4 py-2 text-sm font-mono tracking-widest uppercase rounded-md transition-colors whitespace-nowrap {$page.url.pathname === '/attack' ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}"
	>
		Enumeration / Discovery
	</a>
	<Tooltip position="bottom" class="mr-4" text="Discover and define target endpoints. Optional if targets are already known." />

	<div class="mx-2 flex items-center justify-center text-slate-700 text-[10px] font-bold px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
		OR
	</div>

	<a 
		href="/attack/execute" 
		class="px-4 py-2 ml-4 text-sm font-mono tracking-widest uppercase rounded-md transition-colors whitespace-nowrap {$page.url.pathname === '/attack/execute' ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}"
	>
		Execution Sandbox
	</a>
	<Tooltip position="bottom" text="Launch configured attacks against any targets already gathered." />
</div>
