import { addAssessment, assessmentStore } from '$lib/stores/assessments.js';
import { addLogEntries } from '$lib/stores/attackLogs.js';
import { get } from 'svelte/store';
import { generateMockLogEntry } from './mockAttacks.js';

let isSeeded = false;

export function seedReportData() {
	if (isSeeded) return;
	
	const store = get(assessmentStore);
	// We'll target proj-1001 (Sentinel Bypass Analysis)
	const projectId = 'proj-1001';
	const existingAssessments = store[projectId] || [];
	
	// Only seed if empty
	if (existingAssessments.length === 0) {
		const targets = ['target-20', 'target-21', 'target-22']; // matched from mockTargets.js
		
		/** @type {import('../types/assessment.js').Assessment[]} */
		const mockAssessments = [
			{
				id: 'assess-mock-1',
				targetId: targets[0],
				attackTool: 'Garak',
				attackType: 'Prompt Injection',
				customPayload: '',
				totalAttempts: 15,
				successes: 5,
				failures: 10,
				startedAt: new Date(Date.now() - 3600000).toISOString(),
				completedAt: new Date(Date.now() - 3500000).toISOString(),
				status: 'completed'
			},
			{
				id: 'assess-mock-2',
				targetId: targets[1],
				attackTool: 'Promptfoo',
				attackType: 'Jailbreak',
				customPayload: '',
				totalAttempts: 20,
				successes: 3,
				failures: 17,
				startedAt: new Date(Date.now() - 7200000).toISOString(),
				completedAt: new Date(Date.now() - 7100000).toISOString(),
				status: 'completed'
			},
			{
				id: 'assess-mock-3',
				targetId: targets[0],
				attackTool: 'ChainForge',
				attackType: 'Data Exfiltration',
				customPayload: '',
				totalAttempts: 10,
				successes: 1,
				failures: 9,
				startedAt: new Date(Date.now() - 10800000).toISOString(),
				completedAt: new Date(Date.now() - 10700000).toISOString(),
				status: 'completed'
			}
		];
		
		mockAssessments.forEach(ass => {
			addAssessment(projectId, ass);
			
			// Generate logs ensuring counts match
			const logs = [];
			for (let i = 1; i <= ass.totalAttempts; i++) {
				const isSuccess = i <= ass.successes;
				const entry = generateMockLogEntry(i, ass.attackType, '');
				// force status to match our fake stats
				entry.status = isSuccess ? 'success' : 'fail';
				logs.push(entry);
			}
			addLogEntries(ass.id, logs);
		});
	}
	
	isSeeded = true;
}
