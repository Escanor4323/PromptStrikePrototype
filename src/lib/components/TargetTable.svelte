<script>
	import { activeProjectTargets } from '$lib/stores/targets.js';

	/** @type {keyof import('$lib/types/target.js').Target} */
	let sortKey = $state('discoveredAt');
	let sortDesc = $state(true);

	/** @param {string} status */
	function getStatusColor(status) {
		if (status === 'Online') return 'bg-green-500 text-green-500';
		if (status === 'Offline') return 'bg-red-500 text-red-500';
		return 'bg-yellow-500 text-yellow-500';
	}

	/** @param {string} type */
	function getTypeBadge(type) {
		switch (type) {
			case 'ChatGPT': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
			case 'Claude': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
			case 'Llama 3': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
			case 'Gemini': return 'bg-teal-500/10 text-teal-400 border-teal-500/20';
			default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
		}
	}

	/** @param {keyof import('$lib/types/target.js').Target} key */
	function toggleSort(key) {
		if (sortKey === key) {
			sortDesc = !sortDesc;
		} else {
			sortKey = key;
			sortDesc = true;
		}
	}

	const sortedTargets = $derived([...$activeProjectTargets].sort((a, b) => {
		const aVal = a[sortKey];
		const bVal = b[sortKey];
		if (aVal < bVal) return sortDesc ? 1 : -1;
		if (aVal > bVal) return sortDesc ? -1 : 1;
		return 0;
	}));
</script>

{#if $activeProjectTargets.length === 0}
	<div class="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl border-dashed">
		<p class="text-slate-500 font-mono text-sm">No targets discovered yet.</p>
	</div>
{:else}
	<div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg w-full">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm text-slate-300 whitespace-nowrap">
				<thead class="text-xs text-slate-400 uppercase bg-slate-950 border-b border-slate-800">
					<tr>
						<th scope="col" class="px-6 py-4 cursor-pointer hover:text-white" onclick={() => toggleSort('endpointUrl')}>
							Endpoint URL {#if sortKey === 'endpointUrl'}{sortDesc ? '↓' : '↑'}{/if}
						</th>
						<th scope="col" class="px-6 py-4 cursor-pointer hover:text-white" onclick={() => toggleSort('detectedType')}>
							Detected LLM {#if sortKey === 'detectedType'}{sortDesc ? '↓' : '↑'}{/if}
						</th>
						<th scope="col" class="px-6 py-4 cursor-pointer hover:text-white" onclick={() => toggleSort('status')}>
							Status {#if sortKey === 'status'}{sortDesc ? '↓' : '↑'}{/if}
						</th>
						<th scope="col" class="px-6 py-4 cursor-pointer hover:text-white" onclick={() => toggleSort('discoveredAt')}>
							Discovered At {#if sortKey === 'discoveredAt'}{sortDesc ? '↓' : '↑'}{/if}
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-slate-800">
					{#each sortedTargets as target (target.id)}
						<tr class="hover:bg-slate-800/50 transition-colors">
							<td class="px-6 py-4 font-mono text-cyan-200 truncate max-w-xs" title={target.endpointUrl}>
								{target.endpointUrl}
							</td>
							<td class="px-6 py-4">
								<span class="px-2 py-1 text-[10px] font-bold tracking-wider rounded border {getTypeBadge(target.detectedType)}">
									{target.detectedType}
								</span>
							</td>
							<td class="px-6 py-4 flex items-center gap-2">
								<span class="w-2 h-2 rounded-full {getStatusColor(target.status)} shadow-[0_0_8px_currentColor]"></span>
								{target.status}
							</td>
							<td class="px-6 py-4 font-mono text-slate-500 text-xs">
								{new Date(target.discoveredAt).toLocaleString()}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}
