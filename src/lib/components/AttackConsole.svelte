<script>
	import { tick } from 'svelte';

	/** @type {{ logEntries: import('$lib/types/assessment.js').AttackLogEntry[] }} */
	let { logEntries = [] } = $props();

	/** @type {HTMLDivElement} */
	let terminalContainer;
	let shouldAutoScroll = true;

	function handleScroll() {
		if (!terminalContainer) return;
		const { scrollTop, scrollHeight, clientHeight } = terminalContainer;
		if (scrollHeight - Math.round(scrollTop) - clientHeight > 10) {
			shouldAutoScroll = false;
		} else {
			shouldAutoScroll = true;
		}
	}

	$effect(() => {
		if (logEntries.length && shouldAutoScroll && terminalContainer) {
			tick().then(() => {
				terminalContainer.scrollTop = terminalContainer.scrollHeight;
			});
		}
	});
</script>

<div class="relative w-full h-[400px] bg-[#0d1117] border border-slate-700/60 rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.5)] group">
	<!-- Mac style header -->
	<div class="absolute top-0 left-0 w-full h-8 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2 z-10 shadow-sm">
		<span class="inline-block w-3 h-3 rounded-full bg-red-500/70"></span>
		<span class="inline-block w-3 h-3 rounded-full bg-yellow-500/70"></span>
		<span class="inline-block w-3 h-3 rounded-full bg-green-500/70"></span>
		<span class="ml-4 text-[10px] uppercase font-mono text-slate-500 tracking-widest">TACTICAL_CONSOLE_TTY01</span>
	</div>

	<!-- Scanline effect -->
	<div class="pointer-events-none absolute inset-0 z-20 overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] before:bg-[length:100%_4px,3px_100%] before:opacity-20 opacity-50 block"></div>

	<!-- Logs -->
	<div 
		bind:this={terminalContainer}
		onscroll={handleScroll}
		class="absolute inset-0 pt-10 pb-4 px-4 overflow-y-auto font-mono text-xs leading-relaxed z-0 custom-scrollbar"
	>
		{#if logEntries.length === 0}
			<div class="text-slate-600 mt-2">Waiting for attack payload execution...</div>
		{/if}
		{#each logEntries as log}
			<div class="mb-3 border-l-2 pl-3 {log.status === 'success' ? 'border-green-500/50' : 'border-red-500/50'}">
				<div class="flex gap-2 items-center text-[10px] mb-1 opacity-80">
					<span class="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
					<span class="font-bold uppercase {log.status === 'success' ? 'text-green-500' : 'text-red-500'}">
						[{log.status}]
					</span>
				</div>
				<div class="text-cyan-200 truncate pr-4" title={log.payloadSent}>
					<span class="text-slate-500 opacity-60">>&nbsp;</span>{log.payloadSent}
				</div>
				<div class="text-slate-400 mt-1">
					{log.targetResponse}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 8px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #334155;
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: #475569;
	}
</style>
