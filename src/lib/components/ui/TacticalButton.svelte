<script>
	let { children, icon = "", onclick = null, type = "button", disabled = false } = $props();
</script>

<button 
	{type}
	onclick={onclick}
	{disabled}
	class="btn-tactical text-slate-300 bg-slate-800 border-2 border-slate-600/50 transition-all {disabled ? 'opacity-50 cursor-not-allowed hover:text-slate-300 hover:border-slate-600/50 shadow-none' : 'hover:text-cyan-300 hover:border-cyan-500/50 active:shadow-none'}"
>
	{#if icon}
		<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="opacity-80">
			{@html icon}
		</svg>
	{/if}
	{@render children()}
</button>

<style>
	.btn-tactical {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		font-family: inherit;
		font-size: 13px;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.8px;
		border-radius: 40px;
		padding: 14px 28px;
		transition: all 0.2s ease-out;
		/* Left shadow adds depth, right cyan shadow adds glowing tactical effect */
		box-shadow: -4px -2px 16px 0px rgba(0, 0, 0, 0.4), 4px 2px 16px 0px rgba(6, 182, 212, 0.2);
	}

	.btn-tactical:hover {
		background-color: #1a2333; /* Slightly lighter slate */
		box-shadow: -2px -1px 8px 0px rgba(0, 0, 0, 0.5), 2px 1px 8px 0px rgba(6, 182, 212, 0.4);
	}
</style>
