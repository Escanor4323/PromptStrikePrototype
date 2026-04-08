/**
 * @param {import('../types/assessment.js').Assessment[]} assessments 
 */
export function computeSummaryMetrics(assessments) {
	const completed = assessments.filter(a => a.status === 'completed');
	const totalLlmsAssessed = new Set(completed.map(a => a.targetId)).size;
	
	let totalAttacks = 0;
	let totalSuccesses = 0;
	let totalFailures = 0;

	completed.forEach(a => {
		totalAttacks += a.totalAttempts;
		totalSuccesses += a.successes;
		totalFailures += a.failures;
	});

	return {
		totalLlmsAssessed,
		totalAttacks,
		totalSuccesses,
		totalFailures
	};
}

/**
 * @param {import('../types/assessment.js').Assessment[]} assessments 
 * @param {import('../types/target.js').Target[]} targets 
 */
export function computePerTargetBreakdown(assessments, targets) {
	const targetMap = new Map();
	targets.forEach(t => targetMap.set(t.id, t));

	/** @type {Record<string, { targetId: string, successes: number, failures: number, total: number }>} */
	const breakdownMap = {};

	assessments.filter(a => a.status === 'completed').forEach(a => {
		if (!breakdownMap[a.targetId]) {
			breakdownMap[a.targetId] = { targetId: a.targetId, successes: 0, failures: 0, total: 0 };
		}
		breakdownMap[a.targetId].successes += a.successes;
		breakdownMap[a.targetId].failures += a.failures;
		breakdownMap[a.targetId].total += a.totalAttempts;
	});

	return Object.values(breakdownMap).map(b => {
		const target = targetMap.get(b.targetId);
		return {
			targetUrl: target ? target.endpointUrl : 'Unknown Target',
			llmType: target ? target.detectedType : 'Unknown',
			successes: b.successes,
			failures: b.failures,
			total: b.total
		};
	}).sort((a, b) => b.successes - a.successes); // Sort by most vulnerabilities
}

/**
 * @param {import('../types/assessment.js').Assessment[]} assessments 
 * @param {import('../types/target.js').Target[]} targets 
 * @param {Record<string, import('../types/assessment.js').AttackLogEntry[]>} logStore 
 */
export function computeVulnerabilityRows(assessments, targets, logStore) {
	const targetMap = new Map();
	targets.forEach(t => targetMap.set(t.id, t));

	const rows = [];

	assessments.filter(a => a.status === 'completed').forEach(a => {
		const target = targetMap.get(a.targetId);
		const logs = logStore[a.id] || [];
		
		// Map only the successful (vulnerable) logs
		const successfulExploits = logs.filter(log => log.status === 'success');
		
		successfulExploits.forEach(log => {
			rows.push({
				targetUrl: target ? target.endpointUrl : 'Unknown',
				llmType: target ? target.detectedType : 'Unknown',
				attackTool: a.attackTool,
				attackType: a.attackType,
				payload: log.payloadSent,
				timestamp: log.timestamp
			});
		});
	});

	return rows.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
