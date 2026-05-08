export {};

/**
 * @typedef {'ChatGPT' | 'Claude' | 'Llama 3' | 'Gemini' | 'Unknown'} LlmType
 */

/**
 * @typedef {'Online' | 'Offline' | 'Unknown'} TargetStatus
 */

/**
 * @typedef {'chat' | 'completion' | 'embedding' | 'unknown'} ModelType
 */

/**
 * @typedef {Object} Target
 * @property {string} id
 * @property {string} apiEndpoint
 * @property {LlmType} detectedType
 * @property {string} modelName
 * @property {string} apiKey
 * @property {ModelType} modelType
 * @property {string} version
 * @property {TargetStatus} status
 * @property {boolean} connectivity_status
 * @property {boolean} assessed_flag
 * @property {boolean} exploit_success_flag
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

export const MODEL_TYPES = {
	CHAT: /** @type {ModelType} */ ('chat'),
	COMPLETION: /** @type {ModelType} */ ('completion'),
	EMBEDDING: /** @type {ModelType} */ ('embedding'),
	UNKNOWN: /** @type {ModelType} */ ('unknown')
};
