<script>
	/** @type {{ data: Array<{ label?: string, targetUrl?: string, successes: number, failures: number, total: number }> }} */
	let { data = [] } = $props();

	const rowHeight = 30;
	const barHeight = 12;
	const labelWidth = 140;
	const chartWidth = 300;
	const gap = 10;
	
	let totalHeight = $derived(Math.max(100, data.length * rowHeight + 40));
	let maxTotal = $derived(Math.max(1, ...data.map(d => d.total)));

	/** @param {string} url */
	function formatLabel(url) {
		if (!url) return '';
		try {
			const u = new URL(url);
			return u.hostname || url;
		} catch (e) {
			return url.length > 20 ? url.substring(0, 18) + '...' : url;
		}
	}
</script>

<div class="w-full h-full flex flex-col justify-center text-slate-300">
	{#if data.length === 0}
		<div class="flex items-center justify-center h-full min-h-[200px] border border-slate-800 border-dashed rounded-lg text-slate-600 text-sm font-mono">
			No Target Data Available
		</div>
	{:else}
		<svg viewBox="0 0 {labelWidth + gap + chartWidth + 50} {totalHeight}" class="w-full h-full max-h-[300px]" preserveAspectRatio="xMinYMin meet">
			{#each data as item, i}
				{@const yPos = 30 + i * rowHeight}
				{@const successWidth = (item.successes / maxTotal) * chartWidth}
				{@const failWidth = (item.failures / maxTotal) * chartWidth}
				
				<!-- Label -->
				<text 
					x={labelWidth} 
					y={yPos + 5} 
					text-anchor="end"
					dominant-baseline="middle"
					class="text-[10px] fill-slate-400 font-mono"
				>
					{formatLabel(item.label || item.targetUrl || '')}
				</text>

				<!-- Success bar segment -->
				{#if successWidth > 0}
					<rect 
						x={labelWidth + gap} 
						y={yPos - barHeight/2 + 5} 
						width={successWidth} 
						height={barHeight} 
						fill="#06b6d4" 
						rx="2"
					></rect>
				{/if}

				<!-- Fail bar segment -->
				{#if failWidth > 0}
					<rect 
						x={labelWidth + gap + successWidth + (successWidth > 0 ? 1 : 0)} 
						y={yPos - barHeight/2 + 5} 
						width={failWidth} 
						height={barHeight} 
						fill="#dc2626" 
						rx="2"
					></rect>
				{/if}

				<!-- Values label -->
				<text 
					x={labelWidth + gap + successWidth + failWidth + 8} 
					y={yPos + 5} 
					dominant-baseline="middle"
					class="text-[10px] font-mono"
				>
					<tspan fill="#06b6d4" font-weight="bold">{item.successes}</tspan> 
					<tspan fill="#64748b">/</tspan> 
					<tspan fill="#dc2626">{item.failures}</tspan>
				</text>
			{/each}
			
			<!-- Legend -->
			<g transform="translate({labelWidth + gap}, 0)">
				<rect x="0" y="0" width="8" height="8" fill="#06b6d4" rx="1"></rect>
				<text x="12" y="7" class="text-[9px] fill-slate-500 uppercase tracking-widest font-bold">Vulnerable Exploits</text>
				
				<rect x="115" y="0" width="8" height="8" fill="#dc2626" rx="1"></rect>
				<text x="127" y="7" class="text-[9px] fill-slate-500 uppercase tracking-widest font-bold">Mitigated Blocks</text>
			</g>
		</svg>
	{/if}
</div>
