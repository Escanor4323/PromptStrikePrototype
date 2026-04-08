import { writable, derived } from 'svelte/store';
import { activeProject } from './projects.js';

/** @typedef {Record<string, import('../types/assessment.js').Assessment[]>} AssessmentStore */

/** @type {import('svelte/store').Writable<AssessmentStore>} */
export const assessmentStore = writable({});

/**
 * @param {string} projectId 
 * @param {import('../types/assessment.js').Assessment} newAssessment 
 */
export function addAssessment(projectId, newAssessment) {
	assessmentStore.update(store => {
		const existing = store[projectId] || [];
		return {
			...store,
			[projectId]: [newAssessment, ...existing]
		};
	});
}

/**
 * @param {string} projectId 
 * @param {string} assessmentId 
 * @param {Partial<import('../types/assessment.js').Assessment>} updates 
 */
export function updateAssessment(projectId, assessmentId, updates) {
	assessmentStore.update(store => {
		const existing = store[projectId] || [];
		return {
			...store,
			[projectId]: existing.map(a => a.id === assessmentId ? { ...a, ...updates } : a)
		};
	});
}

/**
 * @param {string} projectId 
 */
export function clearAssessments(projectId) {
	assessmentStore.update(store => {
		return {
			...store,
			[projectId]: []
		};
	});
}

export const activeProjectAssessments = derived(
	[assessmentStore, activeProject],
	([$assessmentStore, $activeProject]) => {
		if (!$activeProject) return [];
		return $assessmentStore[$activeProject.id] || [];
	}
);
