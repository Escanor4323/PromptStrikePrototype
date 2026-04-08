<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/projects');
	});
</script>

<div class="flex h-full items-center justify-center">
	<p class="text-slate-400">Redirecting to Projects...</p>
</div>
