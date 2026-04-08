<script>
	let { title = "Terminal Preview", description = "", tags = [], children } = $props();
</script>

<div class="relative w-full p-5 border border-slate-700/60 rounded-xl bg-slate-900 shadow-[0_4px_8px_rgba(0,0,0,0.3)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(6,182,212,0.15)] hover:border-cyan-500/40 font-sans group">
	<!-- Mac/Terminal Header -->
	<div class="flex items-center gap-2 mb-4">
		<span class="inline-block w-3 h-3 rounded-full bg-red-500/70 group-hover:bg-red-500 transition-colors"></span>
		<span class="inline-block w-3 h-3 rounded-full bg-yellow-500/70 group-hover:bg-yellow-500 transition-colors"></span>
		<span class="inline-block w-3 h-3 rounded-full bg-green-500/70 group-hover:bg-green-500 transition-colors"></span>
	</div>

	<h3 class="text-lg font-bold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors">{title}</h3>
	
	{#if description}
		<p class="text-sm text-slate-400 mb-4">{description}</p>
	{/if}

	{#if tags && tags.length > 0}
		<div class="flex flex-wrap gap-2 mb-4">
			{#each tags as tag}
				<span class="inline-block text-[10px] font-bold uppercase tracking-wider rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 text-cyan-400">
					{tag}
				</span>
			{/each}
		</div>
	{/if}

	<div class="code-editor bg-[#0d1117] text-slate-300 font-mono text-sm leading-relaxed border border-slate-800 rounded-lg p-4 h-[150px] overflow-auto">
		{#if children}
			{@render children()}
		{/if}
	</div>
</div>

<style>
	.code-editor::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}
	.code-editor::-webkit-scrollbar-thumb {
		background: #334155;
		border-radius: 4px;
	}
	.code-editor::-webkit-scrollbar-thumb:hover {
		background: #475569;
	}
</style>
