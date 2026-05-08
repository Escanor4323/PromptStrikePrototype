<script>
	import { addTemplate, deleteTemplate, addTemplateNote, deleteTemplateNote } from '$lib/stores/templates.js';
	import { activeProject } from '$lib/stores/projects.js';

	/** @type {{ templates: import('../types/template.js').AttackTemplate[], onselect?: (payload: string) => void }} */
	let { templates = [], onselect } = $props();

	let newTemplateName = $state('');
	let newTemplatePayload = $state('');
	let showAddForm = $state(false);
	let expandedId = $state('');
	let newNoteText = $state('');

	function handleAddTemplate() {
		if (!$activeProject || !newTemplateName.trim() || !newTemplatePayload.trim()) return;
		addTemplate($activeProject.id, {
			id: crypto.randomUUID(),
			name: newTemplateName.trim(),
			payload: newTemplatePayload.trim(),
			notes: [],
			createdAt: new Date().toISOString()
		});
		newTemplateName = '';
		newTemplatePayload = '';
		showAddForm = false;
	}

	/** @param {string} templateId */
	function handleDelete(templateId) {
		if (!$activeProject) return;
		deleteTemplate($activeProject.id, templateId);
		if (expandedId === templateId) expandedId = '';
	}

	/** @param {string} templateId */
	function handleAddNote(templateId) {
		if (!$activeProject || !newNoteText.trim()) return;
		addTemplateNote($activeProject.id, templateId, {
			id: crypto.randomUUID(),
			text: newNoteText.trim(),
			createdAt: new Date().toISOString()
		});
		newNoteText = '';
	}

	/**
	 * @param {string} templateId
	 * @param {string} noteId
	 */
	function handleDeleteNote(templateId, noteId) {
		if (!$activeProject) return;
		deleteTemplateNote($activeProject.id, templateId, noteId);
	}
</script>

<div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full">
	<div class="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
		<h3 class="text-xs font-bold uppercase tracking-widest text-slate-400">Saved Templates</h3>
		<button
			class="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-1 rounded transition-colors"
			onclick={() => showAddForm = !showAddForm}
		>
			{showAddForm ? 'Cancel' : '+ New'}
		</button>
	</div>

	{#if showAddForm}
		<div class="p-4 border-b border-slate-800 bg-slate-950/50 space-y-2">
			<input
				type="text"
				bind:value={newTemplateName}
				placeholder="Template name..."
				class="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-500"
			/>
			<textarea
				bind:value={newTemplatePayload}
				placeholder="Payload text..."
				rows="3"
				class="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-cyan-500 resize-none"
			></textarea>
			<button
				class="w-full text-xs font-bold py-1.5 text-cyan-400 border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 rounded transition-colors disabled:opacity-40"
				onclick={handleAddTemplate}
				disabled={!newTemplateName.trim() || !newTemplatePayload.trim()}
			>
				Save Template
			</button>
		</div>
	{/if}

	<div class="flex-1 overflow-y-auto divide-y divide-slate-800">
		{#if templates.length === 0}
			<div class="p-6 text-center text-slate-500 text-xs font-mono">No templates saved.</div>
		{:else}
			{#each templates as template (template.id)}
				<div class="group">
					<div class="flex items-start gap-2 px-4 py-3 hover:bg-slate-800/40 transition-colors">
						<button
							class="flex-1 text-left min-w-0"
							onclick={() => onselect?.(template.payload)}
							title="Click to load into compose area"
						>
							<p class="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">{template.name}</p>
							<p class="text-[10px] text-slate-500 font-mono mt-0.5 line-clamp-1">{template.payload}</p>
						</button>
						<div class="flex items-center gap-1 shrink-0">
							<button
								class="text-[10px] text-slate-500 hover:text-cyan-400 px-1.5 py-0.5 rounded border border-transparent hover:border-cyan-500/30 transition-colors"
								onclick={() => expandedId = expandedId === template.id ? '' : template.id}
								title="Notes"
							>
								{template.notes.length > 0 ? `📝 ${template.notes.length}` : '📝'}
							</button>
							<button
								class="text-[10px] text-slate-500 hover:text-red-400 p-0.5 rounded transition-colors"
								onclick={() => handleDelete(template.id)}
								title="Delete template"
							>
								<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
									<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>
					</div>

					{#if expandedId === template.id}
						<div class="px-4 pb-3 bg-slate-950/40 space-y-2">
							{#each template.notes as note (note.id)}
								<div class="flex items-start gap-2 text-[10px] text-slate-400 font-mono bg-slate-900 rounded p-2 border border-slate-800">
									<span class="flex-1">{note.text}</span>
									<button
										class="text-slate-600 hover:text-red-400 transition-colors shrink-0"
										onclick={() => handleDeleteNote(template.id, note.id)}
										title="Delete note"
									>×</button>
								</div>
							{/each}
							<div class="flex gap-1">
								<input
									type="text"
									bind:value={newNoteText}
									placeholder="Add note..."
									class="flex-1 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-[10px] font-mono text-slate-300 outline-none focus:border-cyan-500"
									onkeydown={(e) => e.key === 'Enter' && handleAddNote(template.id)}
								/>
								<button
									class="px-2 py-1 text-[10px] font-bold text-cyan-400 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 rounded transition-colors"
									onclick={() => handleAddNote(template.id)}
								>Add</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		{/if}
	</div>
</div>
