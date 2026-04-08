<script>
	/**
	 * @typedef {Object} MenuItem
	 * @property {string} label
	 * @property {string} icon
	 */
	
	/** @type {{ items: MenuItem[] }} */
	let { items = [] } = $props();
</script>

<div class="menu-container w-full bg-[#0D1117] border border-slate-800 flex flex-col justify-center rounded-lg p-2 gap-1 relative overflow-hidden shadow-lg">
	{#each items as item}
		<button class="menu-item text-slate-300 hover:text-slate-100 hover:bg-slate-800 transition-colors">
			{#if item.icon}
				<svg viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 text-slate-500 transition-colors">
					{@html item.icon}
				</svg>
			{/if}
			<span class="font-medium text-sm tracking-wide">{item.label}</span>
		</button>
	{/each}
</div>

<style>
	.menu-item {
		border: none;
		background: transparent;
		padding: 10px 14px;
		display: flex;
		align-items: center;
		position: relative;
		gap: 10px;
		cursor: pointer;
		border-radius: 6px;
	}

	.menu-item:focus {
		outline: none;
		background-color: #1e293b; /* slate-800 */
	}

	.menu-item::before {
		content: "";
		position: absolute;
		top: 10%;
		left: 0;
		width: 4px;
		height: 80%;
		background-color: #22d3ee; /* cyan-400 */
		border-radius: 0 4px 4px 0;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.menu-item:focus::before,
	.menu-item:active::before {
		opacity: 1;
	}

	/* Blur effect on non-hovered items when hovering the container */
	.menu-container:hover > :not(.menu-item:hover) {
		transition: 300ms ease-in-out;
		filter: blur(1.5px);
		transform: scale(0.96);
		opacity: 0.6;
	}
	
	.menu-container > * {
		transition: transform 300ms ease-in-out, filter 300ms ease-in-out, opacity 300ms ease-in-out, background-color 200ms;
	}
	
	.menu-item:hover svg {
		color: #22d3ee;
	}
</style>
