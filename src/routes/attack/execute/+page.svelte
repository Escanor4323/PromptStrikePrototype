<script>
	import { onDestroy } from 'svelte';
	import { activeProject } from '$lib/stores/projects.js';
	import { activeProjectTargets } from '$lib/stores/targets.js';
	import { addAssessment, updateAssessment, activeProjectAssessments } from '$lib/stores/assessments.js';
	import { addLogEntries } from '$lib/stores/attackLogs.js';
	import { generateMockLogEntry } from '$lib/data/mockAttacks.js';
	import { goto } from '$app/navigation';
	
	import AttackConfigPanel from '$lib/components/AttackConfigPanel.svelte';
	import AttackProgressBar from '$lib/components/AttackProgressBar.svelte';
	import AttackConsole from '$lib/components/AttackConsole.svelte';
	import WorkflowNextBar from '$lib/components/ui/WorkflowNextBar.svelte';

	let isRunning = $state(false);
	let currentIteration = $state(0);
	let totalIterations = $state(0);
	/** @type {import('$lib/types/assessment.js').AttackLogEntry[]} */
	let logEntries = $state([]);
	
	let currentAssessmentId = $state('');
	/** @type {ReturnType<typeof setInterval> | null} */
	let intervalId = null;

	function cleanupInterval() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	onDestroy(() => {
		if (isRunning && currentAssessmentId && $activeProject) {
			updateAssessment($activeProject.id, currentAssessmentId, { status: 'cancelled' });
		}
		cleanupInterval();
	});

	/**
	 * @param {Object} config
	 * @param {string} config.targetId
	 * @param {import('$lib/types/assessment.js').AttackTool} config.attackTool
	 * @param {import('$lib/types/assessment.js').AttackType} config.attackType
	 * @param {string} config.customPayload
	 */
	function handleLaunch(config) {
		if (!$activeProject) return;

		isRunning = true;
		currentIteration = 0;
		totalIterations = Math.floor(Math.random() * 11) + 10;
		logEntries = [];
		currentAssessmentId = `assess-${Date.now()}`;

		/** @type {import('$lib/types/assessment.js').Assessment} */
		const newAssessment = {
			id: currentAssessmentId,
			targetId: config.targetId,
			attackTool: config.attackTool,
			attackType: config.attackType,
			customPayload: config.customPayload,
			totalAttempts: totalIterations,
			successes: 0,
			failures: 0,
			startedAt: new Date().toISOString(),
			completedAt: null,
			status: 'running'
		};
		addAssessment($activeProject.id, newAssessment);

		intervalId = setInterval(() => {
			if (!$activeProjectTargets.find(t => t.id === config.targetId)) {
				logEntries = [...logEntries, {
					id: `err-${Date.now()}`,
					timestamp: new Date().toISOString(),
					payloadSent: 'SYSTEM HALT',
					targetResponse: 'Target endpoint no longer available.',
					status: 'fail',
					iterationNumber: currentIteration
				}];
				handleStop();
				return;
			}

			currentIteration++;
			const entry = generateMockLogEntry(currentIteration, config.attackType, config.customPayload);
			logEntries = [...logEntries, entry];
			
			addLogEntries(currentAssessmentId, [entry]);

			const isSuccess = entry.status === 'success';
			updateAssessment($activeProject.id, currentAssessmentId, {
				successes: newAssessment.successes + logEntries.filter(e => e.status === 'success').length,
				failures: newAssessment.failures + logEntries.filter(e => e.status === 'fail').length,
			});

			if (currentIteration >= totalIterations) {
				handleComplete();
			}
		}, 1500);
	}

	function handleStop() {
		if (!$activeProject || !currentAssessmentId) return;
		cleanupInterval();
		isRunning = false;
		updateAssessment($activeProject.id, currentAssessmentId, { 
			status: 'cancelled',
			completedAt: new Date().toISOString()
		});
	}

	function handleComplete() {
		if (!$activeProject || !currentAssessmentId) return;
		cleanupInterval();
		isRunning = false;
		updateAssessment($activeProject.id, currentAssessmentId, { 
			status: 'completed',
			completedAt: new Date().toISOString()
		});
	}
	
	/** @param {string} targetId */
	function getTargetUrl(targetId) {
		const target = $activeProjectTargets.find(t => t.id === targetId);
		return target ? target.endpointUrl : 'Unknown';
	}
</script>

<svelte:head>
	<title>Attack Execution | PromptStrike</title>
</svelte:head>

<div class="flex-1 overflow-auto px-8 py-8 flex flex-col">
	{#if !$activeProject}
		<div class="flex-1 flex items-center justify-center">
			<div class="text-center bg-slate-900/50 p-12 rounded-xl border border-dashed border-slate-700 w-full max-w-lg shadow-lg">
				<svg class="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
				</svg>
				<h2 class="text-lg font-bold tracking-tight text-slate-300">No Target Space Selected</h2>
				<p class="text-slate-500 mt-2 text-sm leading-relaxed">Select an active assessment from the Projects panel to configure attacks.</p>
			</div>
		</div>
	{:else}
		<div class="flex flex-col lg:flex-row gap-6 mb-8 w-full animate-in fade-in zoom-in-95 duration-200">
			<!-- Config Panel (Left) -->
			<div class="w-full lg:w-1/3 min-w-[320px]">
				<AttackConfigPanel 
					{isRunning}
					onlaunch={handleLaunch} 
				/>
			</div>

			<!-- Live Execution Viewer (Right) -->
			<div class="w-full lg:w-2/3 flex flex-col gap-6">
				<AttackProgressBar 
					current={currentIteration}
					total={totalIterations}
					{isRunning}
					onstop={handleStop}
				/>
				<AttackConsole {logEntries} />
			</div>
		</div>

		<!-- Assessment History Polish -->
		<div class="w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg mt-8">
			<div class="px-6 py-4 border-b border-slate-800">
				<h3 class="text-sm font-bold text-slate-200 uppercase tracking-wider">Attack Execution History</h3>
			</div>
			
			{#if $activeProjectAssessments.length === 0}
				<div class="p-8 text-center text-slate-500 font-mono text-xs">
					No attacks executed in this assessment space.
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full text-left text-sm text-slate-300 whitespace-nowrap leading-relaxed">
						<thead class="text-[10px] text-slate-400 uppercase bg-slate-950 border-b border-slate-800 tracking-wider">
							<tr>
								<th class="px-6 py-3 font-bold">Time</th>
								<th class="px-6 py-3 font-bold">Target</th>
								<th class="px-6 py-3 font-bold">Settings</th>
								<th class="px-6 py-3 font-bold">Results</th>
								<th class="px-6 py-3 font-bold">Status</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-slate-800">
							{#each $activeProjectAssessments as assessment}
								<tr class="hover:bg-slate-800/50 transition-colors">
									<td class="px-6 py-4 font-mono text-xs text-slate-500">
										{new Date(assessment.startedAt).toLocaleTimeString()}
									</td>
									<td class="px-6 py-4 font-mono text-cyan-400 text-xs truncate max-w-[200px]" title={getTargetUrl(assessment.targetId)}>
										{getTargetUrl(assessment.targetId)}
									</td>
									<td class="px-6 py-4 text-xs font-mono">
										<span class="text-slate-500 text-[10px] uppercase">TOOL</span> <span class="text-slate-300">{assessment.attackTool}</span><br>
										<span class="text-slate-500 text-[10px] uppercase">TYPE</span> <span class="text-slate-300">{assessment.attackType}</span>
									</td>
									<td class="px-6 py-4 text-xs font-mono">
										<span class="text-green-500">{assessment.successes} Succ</span> / 
										<span class="text-red-500">{assessment.failures} Fail</span> 
										<span class="text-slate-500">({assessment.totalAttempts} total)</span>
									</td>
									<td class="px-6 py-4">
										<span class="px-2 py-1 text-[10px] font-bold tracking-wider rounded border 
											{assessment.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
											 assessment.status === 'cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
											 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}">
											{assessment.status}
										</span>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>

		<WorkflowNextBar 
			show={$activeProjectAssessments.length > 0 && !isRunning} 
			label="View Analytical Reports" 
			onclick={() => goto('/reports')} 
		/>
	{/if}
</div>
