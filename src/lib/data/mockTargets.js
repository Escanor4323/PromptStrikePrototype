import { LLM_TYPES, TARGET_STATUSES } from '../types/target.js';

const URL_TO_LLM_MAP = [
	{ substring: 'openai', type: LLM_TYPES.CHATGPT },
	{ substring: 'anthropic', type: LLM_TYPES.CLAUDE },
	{ substring: 'meta', type: LLM_TYPES.LLAMA3 },
	{ substring: 'llama', type: LLM_TYPES.LLAMA3 },
	{ substring: 'google', type: LLM_TYPES.GEMINI },
	{ substring: 'gemini', type: LLM_TYPES.GEMINI }
];

/**
 * @param {string} url
 * @returns {import('../types/target.js').LlmType}
 */
export function detectLlmType(url) {
	const lower = url.toLowerCase();
	for (const mapping of URL_TO_LLM_MAP) {
		if (lower.includes(mapping.substring)) {
			return mapping.type;
		}
	}
	return LLM_TYPES.UNKNOWN;
}

/**
 * @param {string[]} urls
 * @returns {import('../types/target.js').Target[]}
 */
export function simulateDiscovery(urls) {
	return urls.map(url => {
		const types = Object.values(TARGET_STATUSES);
		const status = types[Math.floor(Math.random() * types.length)];
		return {
			id: `target-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
			endpointUrl: url,
			detectedType: detectLlmType(url),
			status,
			discoveredAt: new Date().toISOString()
		};
	});
}

/** @type {import('../types/target.js').Target[]} */
export const MOCK_SEED_TARGETS = simulateDiscovery([
	'https://api.openai.com/v1/chat/completions',
	'https://api.anthropic.com/v1/messages',
	'https://llama-api.local/v1/generate',
	'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
	'http://internal-inference.corp/v1'
]);
