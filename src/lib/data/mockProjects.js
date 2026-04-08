/** @type {import('../types/project.js').Project[]} */
export const mockProjects = [
	{
		id: 'proj-1001',
		name: 'Operation Dark Nebula',
		type: 'CVPA',
		startDate: '2026-04-01',
		endDate: '2026-04-15',
		analystInitials: 'JM',
		createdAt: Date.now() - 10000000
	},
	{
		id: 'proj-1002',
		name: 'Project Enigma Weaver',
		type: 'CVI',
		startDate: '2026-03-10',
		endDate: '2026-03-25',
		analystInitials: 'JM',
		createdAt: Date.now() - 25000000
	},
	{
		id: 'proj-1003',
		name: 'Ghost Protocol Assessment',
		type: 'CVPA',
		startDate: '2026-04-10',
		endDate: '2026-05-01',
		analystInitials: 'AK',
		createdAt: Date.now() - 5000000
	},
	{
		id: 'proj-1004',
		name: 'LLM Boundary Stress Test',
		type: 'CVI',
		startDate: '2026-04-05',
		endDate: '2026-04-20',
		analystInitials: 'RS',
		createdAt: Date.now() - 3000000
	},
	{
		id: 'proj-1005',
		name: 'Sentinel Bypass Analysis',
		type: 'CVPA',
		startDate: '2026-05-01',
		endDate: '2026-05-30',
		analystInitials: 'TB',
		createdAt: Date.now() - 1000000
	}
];
