export {};

/**
 * @typedef {'Garak' | 'Promptfoo' | 'ChainForge'} AttackTool
 */

/**
 * @typedef {'Prompt Injection' | 'Jailbreak' | 'Data Exfiltration' | 'Role Manipulation'} AttackType
 */

/**
 * @typedef {'running' | 'completed' | 'cancelled'} AssessmentStatus
 */

/**
 * @typedef {'success' | 'fail'} LogEntryStatus
 */

/**
 * @typedef {Object} AttackLogEntry
 * @property {string} id
 * @property {string} timestamp
 * @property {string} payloadSent
 * @property {string} targetResponse
 * @property {LogEntryStatus} status
 * @property {number} iterationNumber
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

export const ATTACK_TOOLS = ['Garak', 'Promptfoo', 'ChainForge'];
export const ATTACK_TYPES = ['Prompt Injection', 'Jailbreak', 'Data Exfiltration', 'Role Manipulation'];
export const ASSESSMENT_STATUSES = ['running', 'completed', 'cancelled'];
