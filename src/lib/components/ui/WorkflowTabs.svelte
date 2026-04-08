<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';

	// Reactive active tab determination based on pathname
	let pathname = $derived($page.url.pathname);
	let activeTab = $derived(
		pathname.startsWith(`${base}/reports`) ? 4 :
		pathname.startsWith(`${base}/attack/execute`) ? 3 :
		pathname.startsWith(`${base}/attack`) ? 2 :
		1
	);

	/**
	 * @param {number} stepNum
	 * @param {string} path
	 */
	function handleTabClick(stepNum, path) {
		goto(path);
	}

	const steps = [
		{ num: 1, path: `${base}/projects`, label: 'Project Setup', helperMode: 'Create or select a workspace to aggregate targets and reporting.' },
		{ num: 2, path: `${base}/attack`, label: 'Target Enumeration', helperMode: 'Discover targets. Optional if manually provided.' },
		{ num: 3, path: `${base}/attack/execute`, label: 'Attack Execution', helperMode: 'Execute attacks against gathered endpoints.' },
		{ num: 4, path: `${base}/reports`, label: 'Analytical Reporting', helperMode: 'Review metrics and successes.' }
	];
</script>

<div class="tabs-container font-mono bg-slate-950 border-b border-slate-800/80 shadow-md py-6 print:hidden">
	<div class="tabs">
		{#each steps as step}
			<div class="tab-group flex flex-col items-center flex-shrink-0 w-24 md:w-32">
				<input 
					id={`tab${step.num}`} 
					type="checkbox" 
					class="hidden"
					checked={activeTab >= step.num}
					onclick={(e) => { e.preventDefault(); handleTabClick(step.num, step.path); }}
				/>
				<label for={`tab${step.num}`} title={step.label}>
					<span>{step.num}</span>
				</label>
				<div class="h-10 mt-6 flex justify-center w-full">
					<span class="text-[9px] md:text-[10px] text-center tracking-widest uppercase font-bold transition-all duration-300 {activeTab === step.num ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] scale-105' : 'text-slate-600'} flex flex-col items-center gap-1">
						{step.label}
						<Tooltip text={step.helperMode} position="bottom" />
					</span>
				</div>
			</div>
			<!-- Draw line between tabs -->
			{#if step.num < 4}
				<div class="w-8 md:w-24 h-px mt-6 bg-slate-700 flex-shrink-0 transition-colors duration-500 {activeTab > step.num ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : ''}"></div>
			{/if}
		{/each}
	</div>
</div>

<style>
	.tabs-container {
		display: flex;
		justify-content: center;
		width: 100%;
		flex-wrap: wrap;
	}

	.tabs {
		display: flex;
		align-items: flex-start;
		padding-bottom: 24px; /* Space for absolute labels */
	}

	.tab-group {
		position: relative;
	}

	.tab-group input {
		appearance: none;
		display: none;
	}

	.tab-group label {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		line-height: 1.6;
		border: 1px solid #334155;
		border-radius: 12px;
		cursor: pointer;
		font-weight: 700;
		position: relative;
		background-color: transparent;
		color: #94a3b8;
		transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
		z-index: 10;
	}

	.tab-group label::after {
		content: "";
		position: absolute;
		bottom: -20px;
		left: 50%;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: #06b6d4;
		transform: translateX(-50%);
		transform-origin: 0 0;
		scale: 0;
		opacity: 0;
		z-index: -1;
		transition: all 0.48s 0.2s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.tab-group label::before {
		content: "";
		position: absolute;
		top: -24px;
		left: 50%;
		width: 48px;
		height: 48px;
		border-radius: 12px;
		background-color: #06b6d4;
		transform: translate(-50%, -50%);
		z-index: -1;
		opacity: 0;
		scale: 0;
		transform-origin: 0 0;
		transition: all 0.48s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.tab-group label:hover {
		border-color: #06b6d4;
		color: #06b6d4;
	}

	.tab-group input:checked + label {
		border-color: transparent;
		color: #ffffff;
		scale: 1.1;
	}

	.tab-group input:checked + label::after {
		bottom: -16px;
		opacity: 1;
		scale: 1;
		box-shadow:
			0rem 6px 13px rgba(6, 182, 212, 0.1),
			0rem 24px 24px rgba(6, 182, 212, 0.09),
			0rem 55px 33px rgba(6, 182, 212, 0.05),
			0rem 97px 39px rgba(6, 182, 212, 0.01),
			0rem 152px 43px rgba(6, 182, 212, 0);
	}

	.tab-group input:checked + label::before {
		opacity: 1;
		scale: 1;
		top: 50%;
		box-shadow:
			0rem 6px 13px rgba(6, 182, 212, 0.3),
			0rem 24px 24px rgba(6, 182, 212, 0.2),
			0rem 55px 33px rgba(6, 182, 212, 0.1),
			0rem 97px 39px rgba(6, 182, 212, 0.05),
			0rem 152px 43px rgba(6, 182, 212, 0);
	}
</style>
