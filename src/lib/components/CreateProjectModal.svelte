<script>
	import { addProject } from '$lib/stores/projects.js';

	let { onClose } = $props();

	let name = $state('');
	/** @type {import('$lib/types/project.js').Project['type']} */
	let type = $state('CVI');
	let startDate = $state('');
	let endDate = $state('');
	let initials = $state('');

	/** @type {Record<string, string>} */
	let errors = $state({});

	function validate() {
		/** @type {Record<string, string>} */
		let e = {};
		if (!name.trim()) e.name = "Required";
		if (!startDate) e.startDate = "Required";
		if (!endDate) e.endDate = "Required";
		if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
			e.endDate = "Must be after start date";
		}
		if (!initials.match(/^[A-Z]{2,4}$/)) {
			e.initials = "2-4 uppercase letters";
		}
		errors = e;
		return Object.keys(e).length === 0;
	}

	/** @param {Event} e */
	function handleSubmit(e) {
		e.preventDefault();
		if (validate()) {
			addProject({
				name,
				type,
				startDate,
				endDate,
				analystInitials: initials
			});
			onClose();
		}
	}
</script>

<div class="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
	<div 
		class="bg-slate-900 border border-slate-700/60 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200"
		role="dialog"
		aria-modal="true"
	>
		<div class="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
			<h2 class="text-xl font-bold tracking-wide text-slate-100 flex items-center gap-2">
				<svg class="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
				New Assessment
			</h2>
			<button class="text-slate-500 hover:text-slate-300 transition-colors" onclick={onClose} aria-label="Close modal">
				<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<form class="p-6 space-y-5" onsubmit={handleSubmit}>
			<div>
				<label class="block text-sm font-medium text-slate-400 mb-1.5" for="name">Name of Assessment</label>
				<input id="name" type="text" bind:value={name} class="w-full bg-slate-950 border {errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20'} rounded-md py-2 px-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all" placeholder="e.g. Project Enigma Weaver" />
				{#if errors.name}
					<p class="mt-1 text-xs text-red-400">{errors.name}</p>
				{/if}
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-slate-400 mb-1.5" for="type">Assessment Type</label>
					<select id="type" bind:value={type} class="w-full bg-slate-950 border border-slate-700 rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer">
						<option value="CVI">CVI (Code Vulnerability Injection)</option>
						<option value="CVPA">CVPA (Cyber Vulnerability & Penetration Assessment)</option>
					</select>
				</div>
				<div>
					<label class="block text-sm font-medium text-slate-400 mb-1.5" for="initials">Analyst Initials</label>
					<input id="initials" type="text" bind:value={initials} class="w-full bg-slate-950 border {errors.initials ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20'} rounded-md py-2 px-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 transition-all" placeholder="e.g. JM" />
					{#if errors.initials}
						<p class="mt-1 text-xs text-red-400">{errors.initials}</p>
					{/if}
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="block text-sm font-medium text-slate-400 mb-1.5" for="startDate">Start Date</label>
					<input id="startDate" type="date" bind:value={startDate} class="w-full bg-slate-950 border {errors.startDate ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20'} rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 transition-all [color-scheme:dark]" />
					{#if errors.startDate}
						<p class="mt-1 text-xs text-red-400">{errors.startDate}</p>
					{/if}
				</div>
				<div>
					<label class="block text-sm font-medium text-slate-400 mb-1.5" for="endDate">End Date</label>
					<input id="endDate" type="date" bind:value={endDate} class="w-full bg-slate-950 border {errors.endDate ? 'border-red-500 focus:ring-red-500' : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20'} rounded-md py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 transition-all [color-scheme:dark]" />
					{#if errors.endDate}
						<p class="mt-1 text-xs text-red-400">{errors.endDate}</p>
					{/if}
				</div>
			</div>

			<div class="pt-4 mt-2 flex justify-end gap-3 border-t border-slate-800">
				<button type="button" class="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors" onclick={onClose}>
					Cancel
				</button>
				<button type="submit" class="px-5 py-2 text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-md shadow-lg shadow-cyan-900/50 transition-colors">
					Initialize Project
				</button>
			</div>
		</form>
	</div>
</div>
