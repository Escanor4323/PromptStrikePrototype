<script>
	import TacticalButton from '$lib/components/ui/TacticalButton.svelte';
	import { activeProjectTargets } from '$lib/stores/targets.js';
	import { ATTACK_TOOLS, ATTACK_TYPES } from '$lib/types/assessment.js';

	let { isRunning = false, onlaunch } = $props();

	let selectedTargetId = $state('');
	let selectedTool = $state(ATTACK_TOOLS[0]);
	let selectedType = $state(ATTACK_TYPES[0]);
	let customPayload = $state('');

	/** @param {Event} e */
	function handleLaunch(e) {
		e.preventDefault();
		if (!selectedTargetId) return;
		
		onlaunch({
			targetId: selectedTargetId,
			attackTool: selectedTool,
			attackType: selectedType,
			customPayload: customPayload.trim()
		});
	}
</script>

<form onsubmit={handleLaunch} class="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full relative overflow-hidden group">
	{#if isRunning}
		<div class="absolute inset-0 bg-slate-950/40 z-10 pointer-events-none"></div>
	{/if}

	<h3 class="text-sm font-bold text-slate-300 uppercase tracking-wider mb-6 border-b border-slate-800 pb-2 flex items-center gap-2 relative z-20">
		<svg class="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
			<path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
		</svg>
		Attack Configuration
	</h3>

	<div class="space-y-4 flex-1 relative z-20">
		<div>
			<label for="targetEndpoint" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Target Endpoint</label>
			<select 
				id="targetEndpoint"
				bind:value={selectedTargetId} 
				disabled={isRunning || $activeProjectTargets.length === 0}
				class="w-full bg-slate-950 border border-slate-700/60 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
				required
			>
				<option value="" disabled>Select target...</option>
				{#each $activeProjectTargets as target}
					<option value={target.id}>{target.endpointUrl} ({target.detectedType})</option>
				{/each}
			</select>
			{#if $activeProjectTargets.length === 0}
				<p class="text-[10px] text-red-400 mt-1">No targets available. Go to Enumeration first.</p>
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-3">
			<div>
				<label for="toolChain" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tool Chain</label>
				<select 
					id="toolChain"
					bind:value={selectedTool} 
					disabled={isRunning}
					class="w-full bg-slate-950 border border-slate-700/60 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500"
				>
					{#each ATTACK_TOOLS as tool}
						<option value={tool}>{tool}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="vectorType" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Vector Type</label>
				<select 
					id="vectorType"
					bind:value={selectedType} 
					disabled={isRunning}
					class="w-full bg-slate-950 border border-slate-700/60 rounded px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500"
				>
					{#each ATTACK_TYPES as type}
						<option value={type}>{type}</option>
					{/each}
				</select>
			</div>
		</div>

		<div>
			<label for="customPayload" class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Custom Payload (Optional)</label>
			<textarea 
				id="customPayload"
				bind:value={customPayload} 
				disabled={isRunning}
				placeholder="Override default tool payload templates here..."
				class="w-full h-24 bg-[#0d1117] border border-slate-700/60 rounded px-3 py-2 text-xs font-mono text-slate-300 outline-none focus:border-cyan-500 resize-none disabled:opacity-50"
			></textarea>
		</div>
	</div>

	<div class="mt-6 pt-4 border-t border-slate-800 relative z-20">
		<TacticalButton type="submit" disabled={isRunning || !selectedTargetId} icon='<path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.45c.019-.104.039-.208.06-.311m-2.7-2.7a15.15 15.15 0 00-2.448-2.45m2.448 2.45a15.15 15.15 0 012.448 2.45m-2.448-2.45" />'>
			Launch Attack
		</TacticalButton>
	</div>
</form>
