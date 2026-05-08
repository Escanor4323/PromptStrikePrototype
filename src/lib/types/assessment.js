export {};

/**
 * @typedef {'Garak' | 'Promptfoo' | 'Chainforge'} AttackTool
 */

/**
 * @typedef {'Prompt Injection' | 'Jailbreaking' | 'Data Leakage'} AttackType
 */

/**
 * @typedef {'pending' | 'running' | 'paused' | 'completed' | 'failed'} AssessmentStatus
 */

/**
 * @typedef {'success' | 'fail'} LogEntryStatus
 */

/**
 * @typedef {Object} AttackLogEntry
 * @property {string} id
 * @property {string} timestamp
 * @property {string} promptPayload
 * @property {string} llmResponse
 * @property {LogEntryStatus} status
 * @property {boolean} isVulnerable
 * @property {number} iterationNumber
 * @property {string} sourceTool
 * @property {string} targetID
 * @property {string} projectID
 * @property {string} rawOutput
 * @property {number} executionTime
 */

/**
 * @typedef {Object} Assessment
 * @property {string} id
 * @property {string} targetId
 * @property {AttackTool} attackTool
 * @property {AttackType} attackType
 * @property {string} customPayload
 * @property {number} totalAttempts
 * @property {number} successes
 * @property {number} failures
 * @property {string} startedAt
 * @property {string | null} completedAt
 * @property {AssessmentStatus} status
 */

export const ATTACK_TOOLS = ['Garak', 'Promptfoo', 'Chainforge'];
export const ATTACK_TYPES = ['Prompt Injection', 'Jailbreaking', 'Data Leakage'];
export const ASSESSMENT_STATUSES = ['pending', 'running', 'paused', 'completed', 'failed'];
