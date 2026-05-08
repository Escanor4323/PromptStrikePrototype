<script>
	import { activeProject } from '$lib/stores/projects.js';
	import { addTargets } from '$lib/stores/targets.js';
	import { parseEndpointCsv } from '$lib/utils/csvParser.js';
	import { simulateDiscovery } from '$lib/data/mockTargets.js';
	import TacticalButton from '$lib/components/ui/TacticalButton.svelte';

	let manualUrl = $state('');
	let isDiscovering = $state(false);
	let ingestMessage = $state('');
	/** @type {string[]} */
	let offlineWarnings = $state([]);
	/** @type {string[]} */
	let duplicateWarnings = $state([]);

	/** @param {string[]} urls */
	async function handleIngest(urls) {
		if (!$activeProject) {
			ingestMessage = "No active project selected.";
			return;
		}
		if (urls.length === 0) return;

		isDiscovering = true;
		ingestMessage = '';
		offlineWarnings = [];
		duplicateWarnings = [];

		await new Promise(r => setTimeout(r, 1500));

		const discovered = simulateDiscovery(urls);
		const result = addTargets($activeProject.id, discovered);

		offlineWarnings = discovered.filter(t => t.status === 'Offline').map(t => t.apiEndpoint);
		duplicateWarnings = result.skipped;

		isDiscovering = false;
		ingestMessage = `Added ${result.added} endpoint${result.added !== 1 ? 's' : ''}.`;
		manualUrl = '';
		setTimeout(() => ingestMessage = '', 5000);
	}

	/** @param {Event} e */
	function submitManual(e) {
		e.preventDefault();
		if (!manualUrl) return;
		handleIngest([manualUrl]);
	}

	/** @param {Event} e */
	function handleFileUpload(e) {
		const input = /** @type {HTMLInputElement} */ (e.currentTarget);
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (ev) => {
			const text = ev.target?.result;
			if (typeof text === 'string') {
				const { urls } = parseEndpointCsv(text);
				handleIngest(urls);
			}
		};
		reader.readAsText(file);
	}
</script>

<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row gap-6 mb-8 w-full items-stretch shadow-lg">
	<div class="flex-1 flex flex-col justify-center">
		<h3 class="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Manual Target Entry</h3>
		<form onsubmit={submitManual} class="flex gap-3">
			<input 
				type="url" 
				placeholder="https://api.openai.com/v1" 
				bind:value={manualUrl}
				class="flex-1 font-mono bg-slate-950 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-md py-2.5 px-4 text-slate-200 text-sm outline-none transition-colors" 
				disabled={isDiscovering}
				required 
			/>
			<TacticalButton type="submit" icon='<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />'>
				{#if isDiscovering}
					Scan
				{:else}
					Add
				{/if}
			</TacticalButton>
		</form>
	{#if ingestMessage}
		<p class="mt-3 text-xs font-mono text-cyan-400">{ingestMessage}</p>
	{/if}
	{#if offlineWarnings.length > 0}
		<div class="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-md">
			<p class="text-xs font-bold text-yellow-400 mb-1">Offline targets detected:</p>
			{#each offlineWarnings as url}
				<p class="text-xs font-mono text-yellow-300/70 truncate">{url}</p>
			{/each}
		</div>
	{/if}
	{#if duplicateWarnings.length > 0}
		<div class="mt-2 p-2 bg-orange-500/10 border border-orange-500/30 rounded-md">
			<p class="text-xs font-bold text-orange-400 mb-1">Skipped (already added):</p>
			{#each duplicateWarnings as url}
				<p class="text-xs font-mono text-orange-300/70 truncate">{url}</p>
			{/each}
		</div>
	{/if}
	</div>

	<div class="hidden md:block w-px bg-slate-800"></div>

	<div class="flex-1">
		<h3 class="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">Batch CSV Upload</h3>
		<label class="flex flex-col items-center justify-center h-[90px] border-2 border-dashed border-slate-700 bg-slate-950/50 hover:bg-slate-800/50 hover:border-cyan-500/50 transition-colors rounded-lg cursor-pointer group {isDiscovering ? 'opacity-50 pointer-events-none' : ''}">
			<div class="flex flex-col items-center justify-center pt-5 pb-6">
				<svg class="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition-colors mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
				</svg>
				<p class="text-xs text-slate-400"><span class="font-bold text-slate-300 group-hover:text-white transition-colors">Click to upload</span> or drag & drop</p>
			</div>
			<input type="file" accept=".csv" class="hidden" onchange={handleFileUpload} disabled={isDiscovering} />
		</label>
	</div>
</div>
