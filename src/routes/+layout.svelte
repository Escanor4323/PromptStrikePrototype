<script>
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import WorkflowTabs from '$lib/components/ui/WorkflowTabs.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { seedReportData } from '$lib/data/mockReportData.js';
	import { activeProject } from '$lib/stores/projects.js';
	import { activeProjectTargets } from '$lib/stores/targets.js';

	let { children } = $props();

	onMount(() => {
		seedReportData();
	});

	$effect(() => {
		const path = $page.url.pathname;
		if (path === base + '/' || path === base) {
			goto(`${base}/login`, { replaceState: true });
			return;
		}

		if (path.startsWith(`${base}/attack`) && !$activeProject && path !== `${base}/` && path !== `${base}/login`) {
			goto(`${base}/projects`, { replaceState: true });
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>PromptStrike</title>
</svelte:head>

<div class="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-300">
	{#if $page.url.pathname !== `${base}/login`}
		<Sidebar />
	{/if}

	<main class="flex-1 flex flex-col h-full {$page.url.pathname === '/login' ? 'bg-black' : 'bg-slate-900 border-l border-slate-800'} overflow-hidden relative shadow-inner">
		{#if !$page.url.pathname.startsWith(`${base}/settings`) && $page.url.pathname !== `${base}/login`}
			<WorkflowTabs />
		{/if}
		{@render children()}
	</main>
</div>
