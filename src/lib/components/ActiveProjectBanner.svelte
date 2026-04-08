<script>
	import { activeProject, clearActiveProject } from '$lib/stores/projects.js';
</script>

{#if $activeProject}
	<div class="bg-indigo-900/50 border-b border-indigo-500/30 px-6 py-3 flex items-center justify-between shadow-lg sticky top-0 z-10 shrink-0 backdrop-blur-sm">
		<div class="flex items-center gap-3">
			<span class="flex h-2.5 w-2.5 rounded-full bg-indigo-400 animate-[pulse_2s_ease-in-out_infinite]"></span>
			<span class="text-sm text-indigo-200">Active Assessment Context:</span>
			<span class="font-bold tracking-wide text-slate-100">{$activeProject.name}</span>
			<span class="px-2 py-0.5 text-[10px] font-mono tracking-wider rounded border bg-indigo-500/10 text-indigo-400 border-indigo-500/30">
				{$activeProject.type}
			</span>
		</div>
		<button 
			class="text-indigo-300 hover:text-white hover:bg-indigo-800/50 px-3 py-1 text-sm rounded transition-colors flex items-center gap-1 border border-transparent hover:border-indigo-500/30"
			onclick={clearActiveProject}
		>
			<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
			Clear
		</button>
	</div>
{/if}
