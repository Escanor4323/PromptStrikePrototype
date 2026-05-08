<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
</script>

<div class="flex flex-wrap items-center gap-1 bg-slate-900 border-b border-slate-800 px-4 py-2 print:hidden w-full">
	<a
		href="{base}/attack"
		class="px-3 py-2 text-xs font-mono tracking-widest uppercase rounded-md transition-colors whitespace-nowrap {$page.url.pathname === `${base}/attack` ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}"
	>
		Target Enumeration
	</a>

	<a
		href="{base}/attack/manual"
		class="px-3 py-2 text-xs font-mono tracking-widest uppercase rounded-md transition-colors whitespace-nowrap {$page.url.pathname === `${base}/attack/manual` ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}"
	>
		Manual Prompt
	</a>

	<a
		href="{base}/attack/execute"
		class="px-3 py-2 text-xs font-mono tracking-widest uppercase rounded-md transition-colors whitespace-nowrap {$page.url.pathname === `${base}/attack/execute` ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}"
	>
		Tool Attack
	</a>

	<a
		href="{base}/attack/dashboard"
		class="px-3 py-2 text-xs font-mono tracking-widest uppercase rounded-md transition-colors whitespace-nowrap {$page.url.pathname === `${base}/attack/dashboard` ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700/50' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}"
	>
		Dashboard
	</a>
</div>
