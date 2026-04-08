<script>
	let { successes = 0, failures = 0 } = $props();

	let total = $derived(successes + failures);
	let successPercent = $derived(total === 0 ? 0 : (successes / total) * 100);
	
	const C = 100;
	let successDashArray = $derived(`${successPercent} ${C - successPercent}`);
</script>

<div class="relative w-48 h-48 flex items-center justify-center">
	<svg viewBox="0 0 42 42" class="w-full h-full -rotate-90 filter drop-shadow-md pb-[2px]" preserveAspectRatio="xMidYMid meet">
		{#if total === 0}
			<!-- Empty state ring -->
			<circle cx="21" cy="21" r="15.9155" fill="none" stroke="#1e293b" stroke-width="6"></circle>
		{:else}
			<!-- Failures background ring (red) -->
			<circle cx="21" cy="21" r="15.9155" fill="none" stroke="#ef4444" stroke-width="6" class="opacity-80"></circle>
			
			<!-- Successes foreground ring (cyan) -->
			<circle 
				cx="21" cy="21" r="15.9155" 
				fill="none" 
				stroke="#06b6d4" 
				stroke-width="6"
				stroke-dasharray={successDashArray}
				stroke-dashoffset="0"
			></circle>
		{/if}
	</svg>

	<!-- Center metric display -->
	<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
		<span class="text-3xl font-bold {total === 0 ? 'text-slate-600' : 'text-cyan-400'} drop-shadow-sm">
			{Math.round(successPercent)}%
		</span>
		<span class="text-[10px] font-bold tracking-widest uppercase text-slate-500 mt-1">Exploit Rate</span>
	</div>
</div>
