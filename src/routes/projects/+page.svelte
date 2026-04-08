<script>
	import ProjectList from '$lib/components/ProjectList.svelte';
	import ActiveProjectBanner from '$lib/components/ActiveProjectBanner.svelte';
	import CreateProjectModal from '$lib/components/CreateProjectModal.svelte';
	import TacticalButton from '$lib/components/ui/TacticalButton.svelte';
	import WorkflowNextBar from '$lib/components/ui/WorkflowNextBar.svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { activeProject } from '$lib/stores/projects.js';

	let isModalOpen = $state(false);
</script>

<svelte:head>
	<title>Projects | PromptStrike</title>
</svelte:head>

<ActiveProjectBanner />

<div class="p-8 pb-0 shrink-0">
	<header class="flex justify-between items-center mb-8">
		<div>
			<h1 class="text-3xl font-bold text-slate-100 tracking-tight">Assessments</h1>
			<p class="text-slate-400 mt-1">Manage static mock projects for vulnerability testing.</p>
		</div>
		<TacticalButton 
			icon='<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />' 
			onclick={() => isModalOpen = true}
		>
			New Project
		</TacticalButton>
	</header>
</div>

<div class="flex-1 overflow-auto p-8 pt-0">
	<ProjectList />
</div>

<WorkflowNextBar 
	show={$activeProject !== null} 
	label="Continue to Enumeration" 
	onclick={() => goto(`${base}/attack`)}
/>

{#if isModalOpen}
	<CreateProjectModal onClose={() => isModalOpen = false} />
{/if}
