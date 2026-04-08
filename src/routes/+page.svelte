<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	onMount(() => {
		goto(`${base}/projects`);
	});
</script>

<div class="flex h-full items-center justify-center">
	<p class="text-slate-400">Redirecting to Projects...</p>
</div>
