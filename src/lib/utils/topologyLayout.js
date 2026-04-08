import { LLM_TYPES } from '../types/target.js';

export const TYPE_COLOR_MAP = {
	[LLM_TYPES.CHATGPT]: '#3b82f6', // blue-500
	[LLM_TYPES.CLAUDE]: '#f97316', // orange-500
	[LLM_TYPES.LLAMA3]: '#a855f7', // purple-500
	[LLM_TYPES.GEMINI]: '#14b8a6', // teal-500
	[LLM_TYPES.UNKNOWN]: '#64748b' // slate-500
};

/**
 * @typedef {Object} NodePosition
 * @property {string} id
 * @property {string} label
 * @property {string} type
 * @property {string} status
 * @property {number} x
 * @property {number} y
 * @property {number} r
 * @property {string} color
 */

/**
 * @typedef {Object} Edge
 * @property {string} id
 * @property {number} x1
 * @property {number} y1
 * @property {number} x2
 * @property {number} y2
 * @property {string} color
 */

/**
 * @param {import('../types/target.js').Target[]} targets 
 * @param {number} width 
 * @param {number} height 
 * @returns {{ nodes: NodePosition[], edges: Edge[] }}
 */
export function calculateLayout(targets, width = 800, height = 600) {
	const cx = width / 2;
	const cy = height / 2;
	
	// Group by type
	/** @type {Record<string, import('../types/target.js').Target[]>} */
	const groups = {};
	targets.forEach(t => {
		if (!groups[t.detectedType]) groups[t.detectedType] = [];
		groups[t.detectedType].push(t);
	});

	const groupKeys = Object.keys(groups);
	const numGroups = groupKeys.length;
	
	// Base radius for clusters depending on viewport
	const clusterRadius = Math.min(width, height) * 0.3;

	/** @type {NodePosition[]} */
	const nodes = [];
	/** @type {Edge[]} */
	const edges = [];

	groupKeys.forEach((type, i) => {
		const groupTargets = groups[type];
		const angleOffset = (Math.PI * 2) / numGroups;
		const groupAngle = i * angleOffset - Math.PI / 2;
		
		// Center of this cluster
		const gcx = cx + Math.cos(groupAngle) * clusterRadius;
		const gcy = cy + Math.sin(groupAngle) * clusterRadius;

		const numNodes = groupTargets.length;
		const r = Math.max(8, 20 - numNodes * 0.5); // scale down radius if many nodes
		const spreadRadius = Math.min(100, numNodes * 15);

		// Place nodes
		const groupNodes = groupTargets.map((t, j) => {
			let nx = gcx;
			let ny = gcy;
			if (numNodes > 1) {
				const nodeAngle = (Math.PI * 2 * j) / numNodes;
				nx = gcx + Math.cos(nodeAngle) * spreadRadius;
				ny = gcy + Math.sin(nodeAngle) * spreadRadius;
			}
			
			// Try to extract hostname for label
			let label = t.endpointUrl;
			try {
				const url = new URL(t.endpointUrl);
				label = url.hostname || url.pathname;
			} catch (e) {
				// keep default
			}

			return {
				id: t.id,
				label,
				type: String(t.detectedType),
				status: t.status,
				x: nx,
				y: ny,
				r,
				color: TYPE_COLOR_MAP[t.detectedType] || TYPE_COLOR_MAP[LLM_TYPES.UNKNOWN]
			};
		});

		nodes.push(...groupNodes);

		// Edges: hub-and-spoke if > 10, otherwise full mesh inside cluster
		if (numNodes <= 10) {
			for (let a = 0; a < groupNodes.length; a++) {
				for (let b = a + 1; b < groupNodes.length; b++) {
					edges.push({
						id: `${groupNodes[a].id}-${groupNodes[b].id}`,
						x1: groupNodes[a].x,
						y1: groupNodes[a].y,
						x2: groupNodes[b].x,
						y2: groupNodes[b].y,
						color: groupNodes[a].color
					});
				}
			}
		} else {
			// Center hub node logic: use the first node as hub to simplify
			const hubNode = groupNodes[0];
			for (let a = 1; a < groupNodes.length; a++) {
				edges.push({
					id: `${hubNode.id}-${groupNodes[a].id}`,
					x1: hubNode.x,
					y1: hubNode.y,
					x2: groupNodes[a].x,
					y2: groupNodes[a].y,
					color: hubNode.color
				});
			}
		}
	});

	return { nodes, edges };
}
