<script>
	import { base } from '$app/paths';

	/** @type {{ target: import('../types/target.js').Target, assessments: import('../types/assessment.js').Assessment[] }} */
	let { target, assessments = [] } = $props();

	let targetAssessments = $derived(assessments.filter(a => a.targetId === target.id));
	let totalAttacks = $derived(targetAssessments.reduce((sum, a) => sum + a.totalAttempts, 0));
	let successCount = $derived(targetAssessments.reduce((sum, a) => sum + a.successes, 0));
	let failureCount = $derived(targetAssessments.reduce((sum, a) => sum + a.failures, 0));
	let isAssessed = $derived(targetAssessments.some(a => a.status === 'completed'));
	let hasVuln = $derived(successCount > 0);
</script>

<div class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col gap-4 transition-colors group">
	<div class="flex items-start justify-between gap-3">
		<div class="min-w-0 flex-1">
			<p class="text-xs font-mono text-cyan-300 truncate" title={target.apiEndpoint}>{target.apiEndpoint}</p>
			<p class="text-[10px] text-slate-500 mt-0.5 font-mono">{target.modelName || target.detectedType}</p>
		</div>
		<div class="flex flex-col items-end gap-1 shrink-0">
			<span class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border
				{target.detectedType === 'ChatGPT' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
				 target.detectedType === 'Claude' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
				 target.detectedType === 'Gemini' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
				 'bg-slate-800 text-slate-400 border-slate-700'}">
				{target.detectedType}
			</span>
			<span class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border
				{target.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
				 target.status === 'Offline' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
				 'bg-slate-800 text-slate-400 border-slate-700'}">
				{target.status}
			</span>
		</div>
	</div>

	<div class="flex items-center gap-2">
		{#if isAssessed}
			<span class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border bg-cyan-500/10 text-cyan-400 border-cyan-500/30">Assessed</span>
		{:else}
			<span class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border bg-slate-800 text-slate-500 border-slate-700">Not Assessed</span>
		{/if}
		{#if hasVuln}
			<span class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border bg-red-500/10 text-red-400 border-red-500/30">Vulnerable</span>
		{/if}
	</div>

	<div class="grid grid-cols-3 gap-2 text-center">
		<div class="bg-slate-950 rounded p-2">
			<p class="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Attacks</p>
			<p class="text-sm font-bold font-mono text-slate-300">{totalAttacks}</p>
		</div>
		<div class="bg-slate-950 rounded p-2">
			<p class="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Success</p>
			<p class="text-sm font-bold font-mono text-cyan-400">{successCount}</p>
		</div>
		<div class="bg-slate-950 rounded p-2">
			<p class="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Failures</p>
			<p class="text-sm font-bold font-mono text-red-500">{failureCount}</p>
		</div>
	</div>

	<div class="flex gap-2 pt-1 border-t border-slate-800">
		<a
			href="{base}/attack/manual?targetId={target.id}"
			class="flex-1 text-center px-3 py-2 text-xs font-bold text-slate-300 border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white rounded transition-colors"
		>
			Manual Prompt
		</a>
		<a
			href="{base}/attack/execute?targetId={target.id}"
			class="flex-1 text-center px-3 py-2 text-xs font-bold text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 rounded transition-colors"
		>
			Tool Attack
		</a>
	</div>
</div>
