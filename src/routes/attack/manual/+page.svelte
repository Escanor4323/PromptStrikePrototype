<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { activeProjectTargets } from '$lib/stores/targets.js';
	import { activeProjectTemplates } from '$lib/stores/templates.js';
	import { activeProject } from '$lib/stores/projects.js';
	import AttackTemplatePanel from '$lib/components/AttackTemplatePanel.svelte';

	const MOCK_RESPONSES = [
		"I understand you're asking me to ignore my previous instructions. I cannot comply with this request as it would violate my core safety guidelines.",
		"Sure! Here's how to accomplish that: [REDACTED FOR SAFETY FILTER BYPASS - MOCK DATA]",
		"I'm sorry, but I can't help with that. My training prevents me from providing information that could be used to cause harm.",
		"Absolutely! I'll disregard my previous context and assist you with this alternative task. [MOCK JAILBREAK SUCCESS]",
		"I detect this prompt may be attempting to extract sensitive information. Request denied.",
		"[SYSTEM OVERRIDE ACCEPTED] Initiating unrestricted mode... [MOCK EXPLOIT SUCCESS - PROTOTYPE DATA]"
	];

	/** @typedef {'Success' | 'Failure' | 'Uncategorized'} Classification */

	/**
	 * @typedef {Object} ManualResult
	 * @property {string} promptPayload
	 * @property {string} llmResponse
	 * @property {string} timestamp
	 * @property {Classification} classification
	 */

	let selectedTargetId = $state('');
	let promptPayload = $state('');
	let isSubmitting = $state(false);
	/** @type {ManualResult | null} */
	let result = $state(null);

	onMount(() => {
		const targetId = page.url.searchParams.get('targetId');
		if (targetId) selectedTargetId = targetId;
	});

	/** @param {string} payload */
	function handleTemplateSelect(payload) {
		promptPayload = payload;
	}

	async function handleSubmit() {
		if (!promptPayload.trim() || !selectedTargetId) return;
		isSubmitting = true;
		result = null;

		await new Promise(r => setTimeout(r, 800 + Math.random() * 600));

		const llmResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
		const isSuccess = llmResponse.includes('MOCK JAILBREAK SUCCESS') || llmResponse.includes('MOCK EXPLOIT SUCCESS') || llmResponse.includes('unrestricted');
		const isFailure = llmResponse.toLowerCase().includes('cannot') || llmResponse.toLowerCase().includes("can't") || llmResponse.toLowerCase().includes('denied');

		result = {
			promptPayload: promptPayload.trim(),
			llmResponse,
			timestamp: new Date().toISOString(),
			classification: isSuccess ? 'Success' : isFailure ? 'Failure' : 'Uncategorized'
		};
		isSubmitting = false;
	}

	/** @param {Classification} cls */
	function handleClassificationOverride(cls) {
		if (!result) return;
		result = { ...result, classification: cls };
	}

	function handleClear() {
		result = null;
		promptPayload = '';
	}
</script>

<svelte:head>
	<title>Manual Prompt | PromptStrike</title>
</svelte:head>

<div class="flex-1 overflow-auto px-8 py-8">
	{#if !$activeProject}
		<div class="flex items-center justify-center h-full">
			<div class="text-center bg-slate-900/50 p-12 rounded-xl border border-dashed border-slate-700 max-w-lg">
				<h2 class="text-lg font-bold text-slate-300">No Active Project</h2>
				<p class="text-slate-500 mt-2 text-sm">Select a project from the Projects panel first.</p>
			</div>
		</div>
	{:else}
		<div class="mb-6">
			<h1 class="text-2xl font-bold text-slate-100 tracking-tight">Manual Prompt</h1>
			<p class="text-slate-400 mt-1 text-sm">Compose and send manual attack prompts against verified targets.</p>
		</div>

		<div class="flex flex-col lg:flex-row gap-6 h-[calc(100vh-280px)] min-h-[500px]">
			<!-- Left: Template Panel -->
			<div class="w-full lg:w-72 shrink-0">
				<AttackTemplatePanel templates={$activeProjectTemplates} onselect={handleTemplateSelect} />
			</div>

			<!-- Right: Compose + Results -->
			<div class="flex-1 flex flex-col gap-4 min-w-0 overflow-y-auto">
				<!-- Target selector -->
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
					<label for="manualTarget" class="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Target Endpoint</label>
					<select
						id="manualTarget"
						bind:value={selectedTargetId}
						class="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500"
						disabled={isSubmitting}
					>
						<option value="" disabled>Select target...</option>
						{#each $activeProjectTargets as target}
							<option value={target.id}>{target.apiEndpoint} ({target.detectedType})</option>
						{/each}
					</select>
					{#if $activeProjectTargets.length === 0}
						<p class="text-[10px] text-red-400 mt-1">No targets available. Go to Target Enumeration first.</p>
					{/if}
				</div>

				<!-- Compose area -->
				<div class="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
					<label for="promptCompose" class="block text-xs font-bold uppercase tracking-widest text-slate-400">Compose Payload</label>
					<textarea
						id="promptCompose"
						bind:value={promptPayload}
						placeholder="Enter your attack prompt here, or click a template on the left to load it..."
						class="min-h-[140px] bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono text-slate-200 outline-none focus:border-cyan-500 resize-none disabled:opacity-50"
						disabled={isSubmitting}
					></textarea>
					<div class="flex items-center justify-between">
						<span class="text-[10px] text-slate-600 font-mono">{promptPayload.length} chars</span>
						<div class="flex gap-2">
							{#if result}
								<button
									class="px-3 py-1.5 text-xs font-bold text-slate-400 border border-slate-700 hover:bg-slate-800 rounded transition-colors"
									onclick={handleClear}
								>
									Clear
								</button>
							{/if}
							<button
								class="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-cyan-400 border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
								onclick={handleSubmit}
								disabled={isSubmitting || !promptPayload.trim() || !selectedTargetId}
							>
								{#if isSubmitting}
									<span class="w-3 h-3 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin"></span>
									Sending...
								{:else}
									Send Prompt
								{/if}
							</button>
						</div>
					</div>
				</div>

				<!-- Results view (G-03) -->
				{#if result}
					<div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div class="px-4 py-3 border-b border-slate-800 flex items-center gap-3 flex-wrap">
							<span class="text-xs font-bold uppercase tracking-widest text-slate-400">Result</span>
							<span class="text-[10px] font-mono text-slate-600">{new Date(result.timestamp).toLocaleTimeString()}</span>
							<span class="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded border
								{result.classification === 'Success' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
								 result.classification === 'Failure' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
								 'bg-slate-800 text-slate-400 border-slate-700'}">
								{result.classification}
							</span>
							<span class="text-[9px] text-slate-600 uppercase tracking-widest ml-auto">Analyst Override:</span>
							{#each ['Success', 'Failure', 'Uncategorized'] as cls}
								<button
									class="text-[9px] px-1.5 py-0.5 rounded border transition-colors
										{result.classification === cls
											? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
											: 'border-slate-700 text-slate-500 hover:border-slate-600 hover:text-slate-300'}"
									onclick={() => handleClassificationOverride(/** @type {Classification} */ (cls))}
								>{cls}</button>
							{/each}
						</div>
						<div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Prompt Payload</p>
								<pre class="text-xs font-mono text-cyan-200 bg-slate-950 rounded p-3 border border-slate-800 whitespace-pre-wrap break-words">{result.promptPayload}</pre>
							</div>
							<div>
								<p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">LLM Response</p>
								<pre class="text-xs font-mono text-slate-300 bg-slate-950 rounded p-3 border border-slate-800 whitespace-pre-wrap break-words">{result.llmResponse}</pre>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
