<script>
	let { logEntries = [] } = $props();

	let totalAttempts = $derived(logEntries.length);
	let successes = $derived(logEntries.filter(e => e.status === 'success').length);
	let failures = $derived(logEntries.filter(e => e.status === 'fail').length);
	let successRate = $derived(totalAttempts > 0 ? ((successes / totalAttempts) * 100).toFixed(1) : '0.0');
</script>

<div class="grid grid-cols-4 gap-3">
	<div class="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
		<p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Attempts</p>
		<p class="text-2xl font-bold text-slate-200 font-mono">{totalAttempts}</p>
	</div>
	<div class="bg-slate-900 border border-cyan-900/40 rounded-lg p-4 text-center">
		<p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Successes</p>
		<p class="text-2xl font-bold text-cyan-400 font-mono">{successes}</p>
	</div>
	<div class="bg-slate-900 border border-red-900/40 rounded-lg p-4 text-center">
		<p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Failures</p>
		<p class="text-2xl font-bold text-red-500 font-mono">{failures}</p>
	</div>
	<div class="bg-slate-900 border border-slate-800 rounded-lg p-4 text-center">
		<p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Success Rate</p>
		<p class="text-2xl font-bold font-mono {Number(successRate) > 30 ? 'text-orange-400' : 'text-slate-200'}">{successRate}%</p>
	</div>
</div>
