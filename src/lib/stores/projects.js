import { writable } from 'svelte/store';
import { mockProjects } from '../data/mockProjects.js';

export const projectList = writable([...mockProjects]);
/** @type {import('svelte/store').Writable<import('../types/project.js').Project | null>} */
export const activeProject = writable(null);

/**
 * @param {Omit<import('../types/project.js').Project, 'id' | 'createdAt'>} projectData
 */
export function addProject(projectData) {
	projectList.update((list) => {
		return [
			{
				id: `proj-${Math.floor(Math.random() * 10000)}`,
				createdAt: Date.now(),
				...projectData
			},
			...list
		];
	});
}

/**
 * @param {import('../types/project.js').Project | null} project
 */
export function setActiveProject(project) {
	activeProject.set(project);
}

export function clearActiveProject() {
	activeProject.set(null);
}
