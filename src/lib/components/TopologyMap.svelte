<script>
	import { activeProjectTargets } from '$lib/stores/targets.js';
	import { calculateLayout } from '$lib/utils/topologyLayout.js';

	/** @type {string | null} */
	let hoveredNodeId = $state(null);
	/** @type {import('$lib/utils/topologyLayout.js').NodePosition | null} */
	let tooltipNode = $state(null);
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	const topology = $derived(calculateLayout($activeProjectTargets, 800, 600));

	/** 
	 * @param {import('$lib/utils/topologyLayout.js').NodePosition} node 
	 */
	function handleMouseOver(node) {
		hoveredNodeId = node.id;
		tooltipNode = node;
	}

	/** @param {MouseEvent} e */
	function handleMouseMove(e) {
		if (tooltipNode) {
			tooltipX = e.clientX;
			tooltipY = e.clientY;
		}
	}

	function handleMouseOut() {
		hoveredNodeId = null;
		tooltipNode = null;
	}
</script>

{#if $activeProjectTargets.length === 0}
	<div class="text-center py-16 bg-slate-900 border border-slate-800 rounded-xl border-dashed">
		<p class="text-slate-500 font-mono text-sm">Add targets to visualize topology.</p>
	</div>
{:else}
	<div class="bg-slate-900 border border-slate-800 rounded-xl shadow-lg overflow-hidden w-full h-[600px] relative">
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<svg viewBox="0 0 800 600" class="w-full h-full cursor-crosshair" onmousemove={handleMouseMove} role="img" aria-label="Target network topology">
			<g class="edges">
				{#each topology.edges as edge (edge.id)}
					{@const isConnectedToHover = hoveredNodeId ? edge.id.includes(hoveredNodeId) : false}
					{@const opacity = hoveredNodeId ? (isConnectedToHover ? 0.8 : 0.05) : 0.2}
					{@const strokeWidth = hoveredNodeId && isConnectedToHover ? 2 : 1}
					<line 
						x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} 
						stroke={edge.color} 
						stroke-width={strokeWidth}
						opacity={opacity}
						class="transition-all duration-300 pointer-events-none"
					/>
				{/each}
			</g>
			<g class="nodes">
				{#each topology.nodes as node (node.id)}
					{@const isHovered = hoveredNodeId === node.id}
					{@const isDimmed = hoveredNodeId && !isHovered}
					<g 
						class="cursor-pointer transition-opacity duration-300 {isDimmed ? 'opacity-30' : 'opacity-100'}"
						onmouseenter={() => handleMouseOver(node)}
						onmouseleave={handleMouseOut}
						role="button"
						tabindex="0"
					>
						<!-- Outer pulse ring if online -->
						{#if node.status === 'Online'}
							<circle 
								cx={node.x} cy={node.y} r={node.r * 1.5} 
								fill="none" 
								stroke="#22c55e" stroke-width="1"
								opacity="0.3"
								class="pointer-events-none"
							/>
						{/if}
						{#if node.status === 'Offline'}
							<circle 
								cx={node.x} cy={node.y} r={node.r + 2} 
								fill="none" 
								stroke="#ef4444" stroke-width="2"
								class="pointer-events-none"
							/>
						{/if}
						<circle 
							cx={node.x} cy={node.y} r={node.r} 
							fill={node.color} 
							filter="drop-shadow(0 0 10px {node.color}88)"
							class="transition-all duration-300 {isHovered ? 'shadow-lg drop-shadow-[0_0_15px_currentColor]' : ''}"
						/>
						<text 
							x={node.x} y={node.y + node.r + 15} 
							text-anchor="middle"
							class="text-[10px] font-mono fill-slate-300 pointer-events-none"
						>
							{node.label.length > 20 ? node.label.substring(0, 18) + '...' : node.label}
						</text>
					</g>
				{/each}
			</g>
		</svg>

		{#if tooltipNode}
			<div 
				class="fixed z-50 bg-slate-950 border border-slate-700 rounded shadow-xl p-3 pointer-events-none transition-opacity"
				style="left: {tooltipX + 15}px; top: {tooltipY + 15}px;"
			>
				<h4 class="text-slate-100 font-bold text-sm mb-1">{tooltipNode.label}</h4>
				<p class="text-xs text-slate-400 mb-1">Type: <span class="text-cyan-400 font-mono">{tooltipNode.type}</span></p>
				<p class="text-xs text-slate-400">Status: <span class="font-bold {tooltipNode.status === 'Online' ? 'text-green-500' : tooltipNode.status === 'Offline' ? 'text-red-500' : 'text-yellow-500'}">{tooltipNode.status}</span></p>
			</div>
		{/if}
	</div>
{/if}
