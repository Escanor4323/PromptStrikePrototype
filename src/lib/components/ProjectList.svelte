<script>
	import { projectList } from '$lib/stores/projects.js';
	import ProjectCard from './ProjectCard.svelte';
</script>

{#if $projectList.length === 0}
	<div class="text-center py-20 bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed">
		<p class="text-slate-400">No mock assessments found.</p>
	</div>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each $projectList.slice().sort((a, b) => b.createdAt - a.createdAt) as project (project.id)}
			<ProjectCard {project} />
		{/each}
	</div>
{/if}
