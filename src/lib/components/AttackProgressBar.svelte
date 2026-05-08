<script>
	let { current = 0, total = 0, isRunning = false, isPaused = false, onstop, onpause, onresume } = $props();

	let percentage = $derived(total > 0 ? (current / total) * 100 : 0);
	let isComplete = $derived(total > 0 && current >= total);
</script>

<div class="flex items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg w-full">
	<div class="flex-1">
		<div class="flex justify-between items-center mb-2">
			<span class="text-slate-300 font-bold text-sm tracking-wide">
				Attack Progress
				{#if isPaused}
					<span class="ml-2 text-yellow-400 text-[10px] uppercase tracking-widest font-mono">⏸ Paused</span>
				{/if}
			</span>
			<span class="text-cyan-400 font-mono text-xs">{current} / {total} iterations</span>
		</div>
		<div class="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-700/50">
			<div 
				class="h-full transition-all duration-300 ease-out {isPaused ? 'bg-yellow-500/70' : 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]'}" 
				style="width: {percentage}%"
			></div>
		</div>
	</div>
	
	<div class="shrink-0 flex items-center gap-2">
		{#if isRunning && !isPaused}
			<button
				class="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 transition-colors font-bold text-xs uppercase tracking-wider px-3 py-2 rounded"
				onclick={onpause}
			>
				Pause
			</button>
			<button 
				class="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 hover:border-red-400 transition-colors font-bold text-xs uppercase tracking-wider px-3 py-2 rounded shadow-[0_0_8px_rgba(239,68,68,0.2)]"
				onclick={onstop}
			>
				Halt
			</button>
		{:else if isPaused}
			<button
				class="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 transition-colors font-bold text-xs uppercase tracking-wider px-3 py-2 rounded"
				onclick={onresume}
			>
				Resume
			</button>
			<button 
				class="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 hover:border-red-400 transition-colors font-bold text-xs uppercase tracking-wider px-3 py-2 rounded"
				onclick={onstop}
			>
				Halt
			</button>
		{:else if isComplete}
			<div class="text-center py-2 px-3 text-green-500 font-bold text-xs uppercase tracking-wider border border-green-500/30 bg-green-500/10 rounded tracking-widest">
				Complete
			</div>
		{:else}
			<div class="text-center py-2 px-3 text-slate-500 font-bold text-xs uppercase tracking-wider border border-slate-800 bg-slate-950 rounded tracking-widest">
				Idle
			</div>
		{/if}
	</div>
</div>
