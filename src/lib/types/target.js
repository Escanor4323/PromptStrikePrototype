export {};

/**
 * @typedef {'ChatGPT' | 'Claude' | 'Llama 3' | 'Gemini' | 'Unknown'} LlmType
 */

/**
 * @typedef {'Online' | 'Offline' | 'Unknown'} TargetStatus
 */

/**
 * @typedef {Object} Target
 * @property {string} id
 * @property {string} endpointUrl
 * @property {LlmType} detectedType
 * @property {TargetStatus} status
 * @property {string} discoveredAt
 */

export const LLM_TYPES = {
	CHATGPT: /** @type {LlmType} */ ('ChatGPT'),
	CLAUDE: /** @type {LlmType} */ ('Claude'),
	LLAMA3: /** @type {LlmType} */ ('Llama 3'),
	GEMINI: /** @type {LlmType} */ ('Gemini'),
	UNKNOWN: /** @type {LlmType} */ ('Unknown')
};

export const TARGET_STATUSES = {
	ONLINE: /** @type {TargetStatus} */ ('Online'),
	OFFLINE: /** @type {TargetStatus} */ ('Offline'),
	UNKNOWN: /** @type {TargetStatus} */ ('Unknown')
};
