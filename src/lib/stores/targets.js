import { writable, derived } from 'svelte/store';
import { activeProject } from './projects.js';
import { MOCK_SEED_TARGETS } from '../data/mockTargets.js';

/** @typedef {Record<string, import('../types/target.js').Target[]>} TargetStore */

/** @type {import('svelte/store').Writable<TargetStore>} */
export const targetStore = writable({
	'proj-1001': [...MOCK_SEED_TARGETS]
});

/**
 * @param {string} projectId 
 * @param {import('../types/target.js').Target[]} newTargets 
 */
export function addTargets(projectId, newTargets) {
	targetStore.update(store => {
		const existing = store[projectId] || [];
		return {
			...store,
			[projectId]: [...existing, ...newTargets]
		};
	});
}

/**
 * @param {string} projectId 
 * @param {string} targetId 
 */
export function removeTarget(projectId, targetId) {
	targetStore.update(store => {
		const existing = store[projectId] || [];
		return {
			...store,
			[projectId]: existing.filter(t => t.id !== targetId)
		};
	});
}

/**
 * @param {string} projectId 
 */
export function clearTargets(projectId) {
	targetStore.update(store => {
		return {
			...store,
			[projectId]: []
		};
	});
}

export const activeProjectTargets = derived(
	[targetStore, activeProject],
	([$targetStore, $activeProject]) => {
		if (!$activeProject) return [];
		return $targetStore[$activeProject.id] || [];
	}
);
