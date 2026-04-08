<script>
	import { page } from '$app/stores';
	
	const navItems = [
		{ name: 'Active Assessment', path: '/projects', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />' },
		{ name: 'App Settings', path: '/settings/app', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M10.342 5.928c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.688 7.688 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281Z"/>' },
		{ name: 'Account Info', path: '/settings/account', icon: '<path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />' }
	];

	let isOpen = $state(false);
</script>

<!-- Hamburger Button (Mobile Only) -->
<button 
	class="md:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-700 rounded-md text-cyan-400 print:hidden"
	onclick={() => isOpen = !isOpen}
>
	<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
		{#if isOpen}
			<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
		{:else}
			<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
		{/if}
	</svg>
</button>

<!-- Backdrop -->
{#if isOpen}
	<div 
		role="presentation"
		class="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm print:hidden"
		onclick={() => isOpen = false}
		onkeydown={(e) => e.key === 'Escape' && (isOpen = false)}
	></div>
{/if}

<aside class="fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-full shrink-0 transition-transform duration-300 md:translate-x-0 {isOpen ? 'translate-x-0' : '-translate-x-full'} print:hidden">
	<div class="p-6 flex items-center gap-3">
		<svg class="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
		</svg>
		<h1 class="text-xl font-bold tracking-wider text-slate-100 uppercase">Prompt<span class="text-cyan-400">Strike</span></h1>
	</div>
	
	<nav class="menu-container flex-1 space-y-1 mt-4 px-3">
		{#each navItems as item}
			<a 
				href={item.path} 
				class="menu-item transition-colors border border-transparent { $page.url.pathname.startsWith(item.path) ? 'active bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border-transparent' }"
				onclick={() => isOpen = false}
			>
				<svg class="w-5 h-5 transition-colors { $page.url.pathname.startsWith(item.path) ? 'text-cyan-400' : 'opacity-80' }" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
					{@html item.icon}
				</svg>
				<span class="font-medium text-sm tracking-wide">{item.name}</span>
			</a>
		{/each}
	</nav>
	
	<div class="p-4 border-t border-slate-800 text-xs text-slate-500 font-mono text-center">
		VULN_TEST_ENV: OFFLINE
	</div>
</aside>

<style>
	.menu-item {
		padding: 12px 16px;
		display: flex;
		align-items: center;
		position: relative;
		gap: 12px;
		border-radius: 6px;
	}
	.menu-item::before {
		content: "";
		position: absolute;
		top: 10%;
		left: 0;
		width: 4px;
		height: 80%;
		background-color: #22d3ee;
		border-radius: 0 4px 4px 0;
		opacity: 0;
		transition: opacity 0.2s;
	}
	.menu-item.active::before,
	.menu-item:focus::before,
	.menu-item:active::before {
		opacity: 1;
	}
	.menu-container:hover > :not(.menu-item:hover):not(.active) {
		transition: 300ms ease-in-out;
		filter: blur(1.5px);
		transform: scale(0.96);
		opacity: 0.6;
	}
	.menu-container > * {
		transition: transform 300ms ease-in-out, filter 300ms ease-in-out, opacity 300ms ease-in-out, background-color 200ms;
	}
</style>
