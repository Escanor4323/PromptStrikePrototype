import { writable } from 'svelte/store';

/** @typedef {Record<string, import('../types/assessmentResult.js').AssessmentResult[]>} AssessmentResultStore */

/** @type {import('svelte/store').Writable<AssessmentResultStore>} */
export const assessmentResultStore = writable({});

/**
 * @param {string} projectId
 * @param {import('../types/assessmentResult.js').AssessmentResult} result
 */
export function addAssessmentResult(projectId, result) {
	assessmentResultStore.update(store => {
		const existing = store[projectId] || [];
		return {
			...store,
			[projectId]: [result, ...existing]
		};
	});
}
