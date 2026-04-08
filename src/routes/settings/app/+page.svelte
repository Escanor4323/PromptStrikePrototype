<script>
	import TacticalButton from '$lib/components/ui/TacticalButton.svelte';
</script>

<svelte:head>
	<title>App Settings | PromptStrike</title>
</svelte:head>

<div class="flex-1 overflow-auto px-4 md:px-8 py-8 flex flex-col bg-slate-950 animate-in fade-in duration-300">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-slate-100 tracking-wider">Application Settings</h1>
		<p class="text-slate-500 mt-2 text-sm">Configure global execution threads, tool limits, and interface defaults.</p>
	</div>

	<div class="max-w-3xl space-y-6">
		<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
			<h2 class="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">Execution Engine Limits</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div>
					<label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Max Concurrent Threads</label>
					<select class="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer appearance-none">
						<option>1 (Safe Mode)</option>
						<option selected>4 (Default)</option>
						<option>8 (Aggressive)</option>
						<option>16 (Full Force)</option>
					</select>
				</div>
				<div>
					<label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Global Timeout (ms)</label>
					<input type="number" value="30000" class="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-colors" />
				</div>
			</div>
		</div>

		<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
			<h2 class="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">Interface Defaults</h2>
			<div class="flex items-center justify-between py-3">
				<div>
					<div class="text-slate-200 font-bold text-sm">Tactical Mode (Dark UI)</div>
					<div class="text-slate-500 text-xs mt-1">Forces high-contrast styling across all panels. Highly recommended.</div>
				</div>
				<input type="checkbox" checked disabled class="w-5 h-5 accent-cyan-500 opacity-50 cursor-not-allowed" />
			</div>
			<div class="flex items-center justify-between py-3 border-t border-slate-800/50 mt-2">
				<div>
					<div class="text-slate-200 font-bold text-sm">Target Scope Enforcement</div>
					<div class="text-slate-500 text-xs mt-1">Block execution if a target lies outside defined rules of engagement.</div>
				</div>
				<input type="checkbox" checked class="w-5 h-5 accent-cyan-500 cursor-pointer" />
			</div>
			<div class="flex items-center justify-between py-3 border-t border-slate-800/50 mt-2">
				<div>
					<div class="text-slate-200 font-bold text-sm">Show Debug Headers</div>
					<div class="text-slate-500 text-xs mt-1">Expose raw HTTP payloads in execution logs.</div>
				</div>
				<input type="checkbox" class="w-5 h-5 accent-cyan-500 cursor-pointer" />
			</div>
		</div>

		<div class="flex justify-end pt-4 pb-12 print:hidden">
			<TacticalButton type="button" onclick={() => {}}>
				Save Configurations
			</TacticalButton>
		</div>
	</div>
</div>
