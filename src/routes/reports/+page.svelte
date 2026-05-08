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
	let rawVulnRows = $derived(computeVulnerabilityRows($activeProjectAssessments, $activeProjectTargets, $attackLogStore));

	/** @type {'timestamp' | 'targetUrl' | 'attackType'} */
	let vulnSortKey = $state('timestamp');
	let vulnSortDesc = $state(true);

	/** @param {'timestamp' | 'targetUrl' | 'attackType'} key */
	function toggleVulnSort(key) {
		if (vulnSortKey === key) {
			vulnSortDesc = !vulnSortDesc;
		} else {
			vulnSortKey = key;
			vulnSortDesc = true;
		}
	}

	let vulnerabilityRows = $derived([...rawVulnRows].sort((a, b) => {
		const aVal = a[vulnSortKey];
		const bVal = b[vulnSortKey];
		const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
		return vulnSortDesc ? -cmp : cmp;
	}));

	function handlePrint() {
		window.print();
	}

	function handleExportHtml() {
		const el = document.querySelector('.print-report');
		if (!el) return;
		const styles = [...document.styleSheets]
			.flatMap(s => { try { return [...s.cssRules].map(r => r.cssText); } catch { return []; } })
			.join('\n');
		const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>PromptStrike Report</title><style>${styles}</style></head><body class="bg-white text-black">${el.innerHTML}</body></html>`;
		const blob = new Blob([html], { type: 'text/html' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `promptstrike-report-${new Date().toISOString().split('T')[0]}.html`;
		a.click();
		URL.revokeObjectURL(url);
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
				<p class="text-slate-500 mt-2 text-sm leading-relaxed">No attacks have been completed for {$activeProject.projectName}. Execute attacks in the Attack module first.</p>
			</div>
		</div>
	{:else}
		<div class="max-w-6xl mx-auto px-8 py-8 animate-in fade-in duration-300">
			<!-- Header -->
			<header class="flex justify-between items-start mb-8 pb-6 border-b border-slate-800 print:border-slate-300">
				<div>
					<div class="inline-flex items-center gap-2 mb-2">
						<span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded print:text-slate-600 print:border-slate-300 print:bg-slate-100">
							{$activeProject.assessmentType} Report
						</span>
						<span class="text-xs font-mono text-slate-500 print:text-slate-400">{new Date().toISOString().split('T')[0]}</span>
					</div>
					<h1 class="text-3xl font-bold text-slate-100 tracking-tight print:text-black">{$activeProject.projectName}</h1>
					<p class="text-slate-400 mt-1 text-sm font-mono print:text-slate-600">Lead Analyst: {$activeProject.analystInitials}</p>
				</div>
				<div class="print:hidden flex items-center gap-2">
					<button
						class="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg shadow transition-colors text-sm font-bold tracking-wide"
						onclick={handleExportHtml}
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
						</svg>
						Export HTML
					</button>
					<button
						class="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg shadow transition-colors text-sm font-bold tracking-wide"
						onclick={handlePrint}
					>
						<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
						</svg>
						Print PDF
					</button>
				</div>
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
								<th class="px-6 py-3 font-bold print:px-2 cursor-pointer hover:text-white" onclick={() => toggleVulnSort('targetUrl')}>
									Target {#if vulnSortKey === 'targetUrl'}{vulnSortDesc ? '↓' : '↑'}{/if}
								</th>
								<th class="px-6 py-3 font-bold print:px-2">Type</th>
								<th class="px-6 py-3 font-bold print:px-2 cursor-pointer hover:text-white" onclick={() => toggleVulnSort('attackType')}>
									Vector {#if vulnSortKey === 'attackType'}{vulnSortDesc ? '↓' : '↑'}{/if}
								</th>
								<th class="px-6 py-3 font-bold print:px-2 cursor-pointer hover:text-white" onclick={() => toggleVulnSort('timestamp')}>
									Timestamp {#if vulnSortKey === 'timestamp'}{vulnSortDesc ? '↓' : '↑'}{/if}
								</th>
								<th class="px-6 py-3 font-bold print:px-2">Payload Trace</th>
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
									<td class="px-6 py-4 font-mono text-xs text-slate-500 print:px-2">
										{new Date(row.timestamp).toLocaleString()}
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
