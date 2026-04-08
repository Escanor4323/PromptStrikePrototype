<script>
	let { text = "Information", position = "top", class: className = "" } = $props();
</script>

<div class="group relative inline-flex items-center justify-center cursor-help {className}">
	<div class="w-[14px] h-[14px] rounded-full border border-slate-500 text-slate-400 flex items-center justify-center text-[9px] font-bold font-mono hover:text-cyan-400 hover:border-cyan-400 hover:bg-cyan-900/20 transition-colors">
		i
	</div>
	
	<!-- Tooltip Box -->
	<div class="absolute z-[999] pointer-events-none invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 w-48 lg:w-64 bg-slate-800 border border-slate-600 text-slate-200 text-xs rounded shadow-xl p-3 
		{position === 'top' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : ''}
		{position === 'right' ? 'left-full ml-2 top-1/2 -translate-y-1/2' : ''}
		{position === 'left' ? 'right-full mr-2 top-1/2 -translate-y-1/2' : ''}
		{position === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : ''}
	">
		<div class="font-sans leading-relaxed relative">
			{text}
			<!-- Arrow -->
			<div class="absolute w-2 h-2 bg-slate-800 border-slate-600 rotate-45
				{position === 'top' ? 'border-b border-r -bottom-4 left-1/2 -translate-x-1/2' : ''}
				{position === 'right' ? 'border-b border-l -left-4 top-1/2 -translate-y-1/2' : ''}
				{position === 'left' ? 'border-t border-r -right-4 top-1/2 -translate-y-1/2' : ''}
				{position === 'bottom' ? 'border-t border-l -top-4 left-1/2 -translate-x-1/2' : ''}
			"></div>
		</div>
	</div>
</div>
