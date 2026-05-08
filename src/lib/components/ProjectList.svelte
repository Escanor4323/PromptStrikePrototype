<script>
	import { projectList, deleteProject, activeProject, clearActiveProject } from '$lib/stores/projects.js';
	import { clearTargets } from '$lib/stores/targets.js';
	import { clearAssessments } from '$lib/stores/assessments.js';
	import ProjectCard from './ProjectCard.svelte';
	import DeleteProjectModal from './DeleteProjectModal.svelte';

	/** @type {string | null} */
	let pendingDeleteId = $state(null);

	/** @param {string} id */
	function handleDeleteRequest(id) {
		pendingDeleteId = id;
	}

	function confirmDelete() {
		if (!pendingDeleteId) return;
		const id = pendingDeleteId;
		if ($activeProject?.id === id) clearActiveProject();
		clearTargets(id);
		clearAssessments(id);
		deleteProject(id);
		pendingDeleteId = null;
	}
</script>

{#if $projectList.length === 0}
	<div class="text-center py-20 bg-slate-800/30 rounded-xl border border-slate-700/50 border-dashed">
		<p class="text-slate-400">No projects found.</p>
	</div>
{:else}
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
		{#each $projectList.slice().sort((a, b) => b.createdAt - a.createdAt) as project (project.id)}
			<ProjectCard {project} ondelete={handleDeleteRequest} />
		{/each}
	</div>
{/if}

{#if pendingDeleteId}
	<DeleteProjectModal
		projectName={$projectList.find(p => p.id === pendingDeleteId)?.projectName ?? ''}
		onconfirm={confirmDelete}
		oncancel={() => pendingDeleteId = null}
	/>
{/if}
