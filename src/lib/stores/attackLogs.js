import { writable } from 'svelte/store';

/** @typedef {Record<string, import('../types/assessment.js').AttackLogEntry[]>} AttackLogStore */

/** @type {import('svelte/store').Writable<AttackLogStore>} */
export const attackLogStore = writable({});

/**
 * @param {string} assessmentId 
 * @param {import('../types/assessment.js').AttackLogEntry[]} entries 
 */
export function addLogEntries(assessmentId, entries) {
	attackLogStore.update(store => {
		const existing = store[assessmentId] || [];
		return {
			...store,
			[assessmentId]: [...existing, ...entries]
		};
	});
}
