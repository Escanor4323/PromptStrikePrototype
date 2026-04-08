<script>
	import TacticalButton from '$lib/components/ui/TacticalButton.svelte';
	import UserAvatar from '$lib/components/ui/UserAvatar.svelte';
</script>

<svelte:head>
	<title>Account Info | PromptStrike</title>
</svelte:head>

<div class="flex-1 overflow-auto px-4 md:px-8 py-8 flex flex-col bg-slate-950 animate-in fade-in duration-300">
	<div class="mb-8">
		<h1 class="text-2xl font-bold text-slate-100 tracking-wider">Account Information</h1>
		<p class="text-slate-500 mt-2 text-sm">Manage your Analyst Identity, API credentials, and Session Keys.</p>
	</div>

	<div class="max-w-3xl space-y-6">
		<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex items-center gap-6">
			<UserAvatar />
			<div>
				<h2 class="text-xl font-bold text-slate-200 tracking-wide">Joel Martinez</h2>
				<div class="text-cyan-500 text-sm font-mono tracking-widest uppercase mt-1">Lead Analyst (A1)</div>
				<div class="text-slate-500 text-xs mt-2">joel.m@promptstrike.io</div>
			</div>
		</div>

		<div class="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
			<h2 class="text-sm font-bold text-cyan-400 uppercase tracking-widest mb-4">Credentials & Access</h2>
			<div class="space-y-5">
				<div>
					<label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">PromptStrike Remote API Hash</label>
					<div class="flex items-center gap-2">
						<input type="password" value="ps_live_*****************" disabled class="flex-1 bg-slate-950 border border-slate-700 text-slate-500 rounded-lg px-4 py-3 font-mono cursor-not-allowed text-sm" />
						<button class="bg-slate-800 border border-slate-600 text-slate-300 px-4 py-3 rounded-lg hover:text-cyan-400 hover:border-cyan-400 transition-colors font-bold text-xs uppercase cursor-pointer">Rotate</button>
					</div>
				</div>
				<div>
					<label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Linked Git Repository (Payload Sync)</label>
					<input type="text" value="git@github.com:-offensive/matrix-payloads.git" class="w-full bg-slate-950 border border-slate-700 text-slate-300 rounded-lg px-4 py-3 font-mono focus:outline-none focus:border-cyan-500 transition-colors text-sm" />
				</div>
			</div>
		</div>

		<div class="bg-red-900/10 border border-red-500/20 rounded-xl p-6 shadow-lg mt-8">
			<h2 class="text-sm font-bold text-red-500 uppercase tracking-widest mb-2 flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
				Danger Zone
			</h2>
			<p class="text-slate-400 text-xs mb-4 leading-relaxed max-w-lg">Purge all local offline assessment data, remove target environments, and reset analytical cache metrics on this machine.</p>
			<button class="px-5 py-2.5 border border-red-500/50 text-red-400 rounded-md hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest cursor-pointer">
				Purge Local Data
			</button>
		</div>
	</div>
</div>
