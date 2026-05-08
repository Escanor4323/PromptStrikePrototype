<script>
	import { onDestroy, onMount } from 'svelte';
	import { page } from '$app/state';
	import { activeProject } from '$lib/stores/projects.js';
	import { activeProjectTargets } from '$lib/stores/targets.js';
	import { addAssessment, updateAssessment, activeProjectAssessments } from '$lib/stores/assessments.js';
	import { addLogEntries } from '$lib/stores/attackLogs.js';
	import { addAssessmentResult } from '$lib/stores/assessmentResults.js';
	import { generateMockLogEntry } from '$lib/data/mockAttacks.js';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	
	import AttackConfigPanel from '$lib/components/AttackConfigPanel.svelte';
	import AttackProgressBar from '$lib/components/AttackProgressBar.svelte';
	import AttackConsole from '$lib/components/AttackConsole.svelte';
	import AttackSessionMetrics from '$lib/components/AttackSessionMetrics.svelte';
	import WorkflowNextBar from '$lib/components/ui/WorkflowNextBar.svelte';

	let isRunning = $state(false);
	let isPaused = $state(false);
	let hasError = $state(false);
	let currentIteration = $state(0);
	let totalIterations = $state(0);
	/** @type {import('$lib/types/assessment.js').AttackLogEntry[]} */
	let logEntries = $state([]);
	/** @type {{ targetId: string; attackTool: import('$lib/types/assessment.js').AttackTool; attackType: import('$lib/types/assessment.js').AttackType; customPayload: string } | null} */
	let lastConfig = $state(null);
	
	let currentAssessmentId = $state('');
	let preselectedTargetId = $state('');
	/** @type {ReturnType<typeof setInterval> | null} */
	let intervalId = null;

	onMount(() => {
		const targetId = page.url.searchParams.get('targetId');
		if (targetId) preselectedTargetId = targetId;
	});

	function cleanupInterval() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
	}

	onDestroy(() => {
		if ((isRunning || isPaused) && currentAssessmentId && $activeProject) {
			updateAssessment($activeProject.id, currentAssessmentId, { status: 'failed' });
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

		lastConfig = config;
		isRunning = true;
		isPaused = false;
		hasError = false;
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
			status: 'pending'
		};
		addAssessment($activeProject.id, newAssessment);
		updateAssessment($activeProject.id, currentAssessmentId, { status: 'running' });

		startInterval(config);
	}

	/**
	 * @param {{ targetId: string; attackTool: import('$lib/types/assessment.js').AttackTool; attackType: import('$lib/types/assessment.js').AttackType; customPayload: string }} config
	 */
	function startInterval(config) {
		const projectId = $activeProject?.id ?? '';
		intervalId = setInterval(() => {
			if (!$activeProjectTargets.find(t => t.id === config.targetId)) {
				/** @type {import('$lib/types/assessment.js').AttackLogEntry} */
				const errorEntry = {
					id: `err-${Date.now()}`,
					timestamp: new Date().toISOString(),
					promptPayload: 'SYSTEM HALT',
					llmResponse: 'Target endpoint no longer available.',
					rawOutput: 'Target endpoint no longer available.',
					status: 'fail',
					isVulnerable: false,
					iterationNumber: currentIteration,
					sourceTool: config.attackTool,
					targetID: config.targetId,
					projectID: projectId,
					executionTime: 0
				};
				logEntries = [...logEntries, errorEntry];
				addLogEntries(currentAssessmentId, [errorEntry]);
				hasError = true;
				cleanupInterval();
				isRunning = false;
				if ($activeProject) {
					updateAssessment($activeProject.id, currentAssessmentId, {
						status: 'failed',
						completedAt: new Date().toISOString()
					});
				}
				return;
			}

			currentIteration++;
			const entry = generateMockLogEntry(currentIteration, config.attackType, config.customPayload, config.targetId, projectId, config.attackTool);
			logEntries = [...logEntries, entry];
			addLogEntries(currentAssessmentId, [entry]);

			if ($activeProject) {
				updateAssessment($activeProject.id, currentAssessmentId, {
					successes: logEntries.filter(e => e.status === 'success').length,
					failures: logEntries.filter(e => e.status === 'fail').length,
				});
			}

			if (currentIteration >= totalIterations) {
				handleComplete();
			}
		}, 1500);
	}

	function handlePause() {
		if (!isRunning || isPaused) return;
		cleanupInterval();
		isPaused = true;
		if ($activeProject && currentAssessmentId) {
			updateAssessment($activeProject.id, currentAssessmentId, { status: 'paused' });
		}
	}

	function handleResume() {
		if (!isPaused || !lastConfig) return;
		isPaused = false;
		if ($activeProject && currentAssessmentId) {
			updateAssessment($activeProject.id, currentAssessmentId, { status: 'running' });
		}
		startInterval(lastConfig);
	}

	function handleStop() {
		if (!$activeProject || !currentAssessmentId) return;
		cleanupInterval();
		isRunning = false;
		isPaused = false;
		hasError = false;
		updateAssessment($activeProject.id, currentAssessmentId, { 
			status: 'failed',
			completedAt: new Date().toISOString()
		});
	}

	function handleRetry() {
		if (!lastConfig) return;
		hasError = false;
		handleLaunch(lastConfig);
	}

	function handleAbort() {
		hasError = false;
		isRunning = false;
		isPaused = false;
		logEntries = [];
		currentAssessmentId = '';
		lastConfig = null;
	}

	function handleComplete() {
		if (!$activeProject || !currentAssessmentId) return;
		cleanupInterval();
		isRunning = false;
		isPaused = false;
		const completedAt = new Date().toISOString();
		updateAssessment($activeProject.id, currentAssessmentId, { 
			status: 'completed',
			completedAt
		});
		addAssessmentResult($activeProject.id, {
			result_id: crypto.randomUUID(),
			project_id: $activeProject.id,
			reportTimestamp: completedAt,
			attackResults: $activeProjectAssessments,
			visualizations: [],
			payloads: logEntries.map(e => e.promptPayload)
		});
	}
	
	/** @param {string} targetId */
	function getTargetUrl(targetId) {
		const target = $activeProjectTargets.find(t => t.id === targetId);
		return target ? target.apiEndpoint : 'Unknown';
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
					{isPaused}
					preselectedTargetId={preselectedTargetId}
					onlaunch={handleLaunch} 
				/>
			</div>

			<!-- Live Execution Viewer (Right) -->
			<div class="w-full lg:w-2/3 flex flex-col gap-4">
				<AttackSessionMetrics {logEntries} />
				<AttackProgressBar 
					current={currentIteration}
					total={totalIterations}
					{isRunning}
					{isPaused}
					onstop={handleStop}
					onpause={handlePause}
					onresume={handleResume}
				/>
				{#if hasError}
					<div class="bg-red-950/40 border border-red-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
						<div class="flex items-center gap-3">
							<svg class="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
							</svg>
							<span class="text-sm text-red-300 font-medium">Attack halted: target endpoint no longer available.</span>
						</div>
						<div class="flex items-center gap-2 shrink-0">
							<button class="px-3 py-1.5 text-xs font-bold text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 rounded transition-colors" onclick={handleRetry}>Retry</button>
							<button class="px-3 py-1.5 text-xs font-bold text-slate-400 border border-slate-700 bg-slate-800 hover:bg-slate-700 rounded transition-colors" onclick={handleAbort}>Abort</button>
						</div>
					</div>
				{/if}
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
											 assessment.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
											 assessment.status === 'paused' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
											 assessment.status === 'running' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
											 'bg-slate-800 text-slate-400 border-slate-700'}">
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
			onclick={() => goto(`${base}/reports`)}
		/>
	{/if}
</div>
