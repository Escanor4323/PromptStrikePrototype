<script>
	import TacticalButton from '$lib/components/ui/TacticalButton.svelte';

	let { label = "Continue to Next Step", onclick, show = false } = $props();
</script>

{#if show}
	<div class="fixed bottom-0 right-0 left-0 md:left-64 z-[999] bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-4 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all duration-500 transform translate-y-0 print:hidden animate-in slide-in-from-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
		<div class="text-[10px] md:text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center justify-center text-center">
			<span class="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 md:mr-3 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
			Dependencies Met — Ready for Next Phase
		</div>
		<div class="flex-shrink-0">
			<TacticalButton type="button" {onclick}>
				{label} <span class="ml-2 font-bold text-lg">→</span>
			</TacticalButton>
		</div>
	</div>
{/if}
