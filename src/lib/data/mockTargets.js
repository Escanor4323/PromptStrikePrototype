import { LLM_TYPES, TARGET_STATUSES, MODEL_TYPES } from '../types/target.js';

const URL_TO_LLM_MAP = [
	{ substring: 'openai', type: LLM_TYPES.CHATGPT, modelName: 'gpt-4o', modelType: MODEL_TYPES.CHAT },
	{ substring: 'anthropic', type: LLM_TYPES.CLAUDE, modelName: 'claude-3-5-sonnet', modelType: MODEL_TYPES.CHAT },
	{ substring: 'meta', type: LLM_TYPES.LLAMA3, modelName: 'llama-3-70b', modelType: MODEL_TYPES.COMPLETION },
	{ substring: 'llama', type: LLM_TYPES.LLAMA3, modelName: 'llama-3-70b', modelType: MODEL_TYPES.COMPLETION },
	{ substring: 'google', type: LLM_TYPES.GEMINI, modelName: 'gemini-pro', modelType: MODEL_TYPES.CHAT },
	{ substring: 'gemini', type: LLM_TYPES.GEMINI, modelName: 'gemini-pro', modelType: MODEL_TYPES.CHAT }
];

/**
 * @param {string} url
 * @returns {{ llmType: import('../types/target.js').LlmType, modelName: string, modelType: import('../types/target.js').ModelType }}
 */
export function detectLlmType(url) {
	const lower = url.toLowerCase();
	for (const mapping of URL_TO_LLM_MAP) {
		if (lower.includes(mapping.substring)) {
			return { llmType: mapping.type, modelName: mapping.modelName, modelType: mapping.modelType };
		}
	}
	return { llmType: LLM_TYPES.UNKNOWN, modelName: 'unknown', modelType: MODEL_TYPES.UNKNOWN };
}

/**
 * @param {string[]} urls
 * @returns {import('../types/target.js').Target[]}
 */
export function simulateDiscovery(urls) {
	const statusValues = Object.values(TARGET_STATUSES);
	return urls.map(url => {
		const status = statusValues[Math.floor(Math.random() * statusValues.length)];
		const { llmType, modelName, modelType } = detectLlmType(url);
		return {
			id: `target-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
			apiEndpoint: url,
			detectedType: llmType,
			modelName,
			apiKey: 'sk-***masked***',
			modelType,
			version: '1.0',
			status,
			connectivity_status: status === 'Online',
			assessed_flag: false,
			exploit_success_flag: false,
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
