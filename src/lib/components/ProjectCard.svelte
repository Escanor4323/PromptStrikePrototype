<script>
	import { setActiveProject } from '$lib/stores/projects.js';

	let { project } = $props();
	let isCvi = $derived(project.type === 'CVI');
</script>

<div 
	class="relative w-full p-5 border border-slate-700/60 rounded-xl bg-slate-900 shadow-[0_4px_8px_rgba(0,0,0,0.3)] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(6,182,212,0.15)] hover:border-cyan-500/40 font-sans group flex flex-col h-full"
	onclick={() => setActiveProject(project)}
	onkeydown={(e) => e.key === 'Enter' && setActiveProject(project)}
	role="button"
	tabindex="0"
>
	<div class="flex justify-between items-start mb-4">
		<!-- Mac Header -->
		<div class="flex items-center gap-2">
			<span class="inline-block w-3 h-3 rounded-full bg-red-500/70 group-hover:bg-red-500 transition-colors"></span>
			<span class="inline-block w-3 h-3 rounded-full bg-yellow-500/70 group-hover:bg-yellow-500 transition-colors"></span>
			<span class="inline-block w-3 h-3 rounded-full bg-green-500/70 group-hover:bg-green-500 transition-colors"></span>
		</div>
		<span class="px-2.5 py-1 text-[10px] font-bold tracking-wider rounded border {isCvi ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}">
			{project.type}
		</span>
	</div>

	<h3 class="text-lg font-bold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">{project.name}</h3>
	<p class="text-[10px] uppercase tracking-wider text-slate-500 mb-5 font-mono">{project.id}</p>

	<div class="code-editor bg-[#0d1117] text-slate-300 font-mono leading-relaxed border border-slate-800 rounded-lg p-4 mt-auto">
		<div class="flex flex-col gap-3">
			<div class="flex items-center gap-3">
				<svg class="w-4 h-4 text-slate-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
				</svg>
				<span class="text-xs text-slate-400 tracking-tight">{project.startDate} &mdash; {project.endDate}</span>
			</div>
			<div class="flex items-center gap-3">
				<div class="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-300 shrink-0">
					{project.analystInitials}
				</div>
				<span class="text-xs text-slate-400">Lead Analyst</span>
			</div>
		</div>
	</div>
</div>
