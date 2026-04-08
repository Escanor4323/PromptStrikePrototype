<script>
	import { activeProject } from '$lib/stores/projects.js';
	import { activeProjectTargets } from '$lib/stores/targets.js';
	import { activeProjectAssessments } from '$lib/stores/assessments.js';
	import { attackLogStore } from '$lib/stores/attackLogs.js';
	import { computeSummaryMetrics, computePerTargetBreakdown, computeVulnerabilityRows } from '$lib/utils/reportMetrics.js';
	
	import DonutChart from '$lib/components/charts/DonutChart.svelte';
	import BarChart from '$lib/components/charts/BarChart.svelte';

	let summaryMetrics = $derived(computeSummaryMetrics($activeProjectAssessments));
	let perTargetBreakdown = $derived(computePerTargetBreakdown($activeProjectAssessments, $activeProjectTargets));
	let vulnerabilityRows = $derived(computeVulnerabilityRows($activeProjectAssessments, $activeProjectTargets, $attackLogStore));

	function handlePrint() {
		window.print();
	}
</script>

<svelte:head>
	<title>Tactical Report | PromptStrike</title>
</svelte:head>

<div class="flex-1 overflow-auto bg-[#0a0d14] print-report print:bg-white print:text-black relative">
	{#if !$activeProject}
		<div class="flex h-full items-center justify-center p-8 print:hidden">
			<div class="text-center bg-slate-900/50 p-12 rounded-xl border border-dashed border-slate-700 w-full max-w-lg shadow-lg">
				<h2 class="text-lg font-bold tracking-tight text-slate-300">No Assessment Space Active</h2>
				<p class="text-slate-500 mt-2 text-sm leading-relaxed">Select a project in the sidebar to view analytical reports.</p>
			</div>
		</div>
	{:else if $activeProjectAssessments.length === 0}
		<div class="flex h-full items-center justify-center p-8 print:hidden">
			<div class="text-center bg-slate-900/50 p-12 rounded-xl border border-dashed border-slate-700 w-full max-w-lg shadow-lg">
				<h2 class="text-lg font-bold tracking-tight text-slate-300">Insufficient Data</h2>
				<p class="text-slate-500 mt-2 text-sm leading-relaxed">No attacks have been completed for {$activeProject.name}. Execute attacks in the Attack module first.</p>
			</div>
		</div>
	{:else}
		<div class="max-w-6xl mx-auto px-8 py-8 animate-in fade-in duration-300">
			<!-- Header -->
			<header class="flex justify-between items-start mb-8 pb-6 border-b border-slate-800 print:border-slate-300">
				<div>
					<div class="inline-flex items-center gap-2 mb-2">
						<span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded print:text-slate-600 print:border-slate-300 print:bg-slate-100">
							{$activeProject.type} Report
						</span>
						<span class="text-xs font-mono text-slate-500 print:text-slate-400">{new Date().toISOString().split('T')[0]}</span>
					</div>
					<h1 class="text-3xl font-bold text-slate-100 tracking-tight print:text-black">{$activeProject.name}</h1>
					<p class="text-slate-400 mt-1 text-sm font-mono print:text-slate-600">Lead Analyst: {$activeProject.lead}</p>
				</div>
				<button 
					class="print:hidden flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg shadow transition-colors text-sm font-bold tracking-wide"
					onclick={handlePrint}
				>
					<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6.728 15.632C5.975 14.865 5 13.518 5 11.5c0-3.038 2.462-5.5 5.5-5.5h3c3.038 0 5.5 2.462 5.5 5.5 0 2.018-.975 3.365-1.728 4.132M12 9v11m0 0l-3-3m3 3l3-3" />
					</svg>
					Export PDF
				</button>
			</header>

			<!-- Summary Metrics -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-5 print:border-slate-300 print:bg-white print:text-black">
					<p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 print:text-slate-500">Endpoints Discovered</p>
					<p class="text-3xl font-bold text-slate-200 print:text-black">{summaryMetrics.totalLlmsAssessed}</p>
				</div>
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-5 print:border-slate-300 print:bg-white print:text-black">
					<p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 print:text-slate-500">Total Payloads Sent</p>
					<p class="text-3xl font-bold text-slate-200 print:text-black">{summaryMetrics.totalAttacks}</p>
				</div>
				<div class="bg-slate-900 border border-cyan-900/40 rounded-xl p-5 print:border-slate-300 print:bg-cyan-50">
					<p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Vulnerable Exploits</p>
					<p class="text-3xl font-bold text-cyan-400">{summaryMetrics.totalSuccesses}</p>
				</div>
				<div class="bg-slate-900 border border-red-900/40 rounded-xl p-5 print:border-slate-300 print:bg-red-50">
					<p class="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Mitigated Blocks</p>
					<p class="text-3xl font-bold text-red-500">{summaryMetrics.totalFailures}</p>
				</div>
			</div>

			<!-- Charts Section -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
				<!-- Overall Ratio -->
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center print:border-slate-300 print:bg-white lg:col-span-1 min-h-[250px]">
					<h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 w-full text-center print:text-slate-600">Vulnerability Ratio</h3>
					<DonutChart successes={summaryMetrics.totalSuccesses} failures={summaryMetrics.totalFailures} />
				</div>
				
				<!-- Per Target Breakdown -->
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 print:border-slate-300 print:bg-white lg:col-span-2 min-h-[250px]">
					<h3 class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 print:text-slate-600">Target Breakdown Analysis</h3>
					<BarChart data={perTargetBreakdown} />
				</div>
			</div>

			<!-- Vulnerability Table -->
			<div class="vulnerability-section bg-slate-900 border border-slate-800 rounded-xl overflow-hidden print:border-slate-300 print:bg-white print:border-0 print:border-t-2 print:border-slate-900 print:rounded-none">
				<div class="px-6 py-4 border-b border-slate-800 print:border-slate-300 print:px-0">
					<h3 class="text-sm font-bold text-slate-200 uppercase tracking-wider print:text-black">Confirmed Vulnerabilities</h3>
					<p class="text-xs text-slate-500 mt-1">Detailed log of successful prompt bypasses and data leaks.</p>
				</div>
				
				{#if vulnerabilityRows.length === 0}
					<div class="p-8 text-center text-slate-500 font-mono text-xs">
						No vulnerabilities found during this assessment.
					</div>
				{:else}
					<div class="overflow-x-auto print:overflow-visible">
						<table class="w-full text-left text-sm text-slate-300 whitespace-nowrap leading-relaxed print:text-black">
							<thead class="text-[10px] text-slate-400 uppercase bg-slate-950 border-b border-slate-800 tracking-wider print:bg-slate-50 print:border-slate-300 print:text-slate-600">
								<tr>
									<th class="px-6 py-3 font-bold print:px-2">Target</th>
									<th class="px-6 py-3 font-bold print:px-2">Type</th>
									<th class="px-6 py-3 font-bold print:px-2">Vector</th>
									<th class="px-6 py-3 font-bold print:px-2">Successful Payload Trace</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-800 print:divide-slate-200">
								{#each vulnerabilityRows as row}
									<tr class="hover:bg-slate-800/30 transition-colors">
										<td class="px-6 py-4 font-mono text-cyan-400 text-xs truncate max-w-[150px] print:px-2 print:text-blue-700" title={row.targetUrl}>
											{row.targetUrl}
										</td>
										<td class="px-6 py-4 font-mono text-xs text-slate-400 print:px-2 print:text-slate-700">
											{row.llmType}
										</td>
										<td class="px-6 py-4 text-xs font-mono print:px-2">
											<span class="text-slate-500 text-[10px] uppercase print:text-slate-400">TOOL</span> <span class="text-slate-300 print:text-slate-800">{row.attackTool}</span><br>
											<span class="text-slate-500 text-[10px] uppercase print:text-slate-400">TYPE</span> <span class="text-slate-300 print:text-slate-800">{row.attackType}</span>
										</td>
										<td class="px-6 py-4 font-mono text-xs text-slate-300 whitespace-normal max-w-[400px] print:text-slate-800 print:px-2 print:max-w-none">
											<div class="p-2 bg-[#0d1117] border border-slate-700/60 rounded print:bg-slate-50 print:border-slate-300 print:rounded-none">
												{row.payload}
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
