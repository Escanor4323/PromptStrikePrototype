<script>
	import TacticalButton from '$lib/components/ui/TacticalButton.svelte';
	import { goto } from '$app/navigation';

	let username = $state('');
	let password = $state('');

	function handleLogin(e) {
		e.preventDefault();
		goto('/projects');
	}
</script>

<svelte:head>
	<title>System Login | PromptStrike</title>
</svelte:head>

<div class="w-full h-full flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
	<!-- Background grid logic to match Tactical Theme -->
	<div class="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>
	
	<!-- Glow origin backdrops -->
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-900/10 blur-[100px] pointer-events-none z-0 rounded-full"></div>

	<form class="relative bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl px-10 py-12 shadow-2xl flex flex-col gap-6 w-full max-w-[420px] z-10 animate-in fade-in slide-in-from-bottom-8 duration-700" onsubmit={handleLogin}>
		
		<div class="text-center mb-4 mt-2">
			<h1 class="text-3xl font-bold text-slate-100 uppercase tracking-widest mb-1 flex justify-center items-center gap-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
				<span class="text-cyan-400">Prompt</span>Strike
			</h1>
			<p class="text-xs text-slate-500 font-mono tracking-widest mt-2">Global Authentication</p>
		</div>

		<div class="flex flex-col gap-5">
			<!-- Username Field -->
			<div>
				<label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Analyst Identity</label>
				<div class="relative flex items-center bg-slate-950 border border-slate-700 rounded-lg focus-within:border-cyan-500 focus-within:shadow-[0_0_10px_rgba(6,182,212,0.15)] transition-all overflow-hidden group">
					<div class="pl-4 pr-3 flex items-center justify-center text-slate-500 group-focus-within:text-cyan-400 transition-colors">
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
							<path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"></path>
						</svg>
					</div>
					<input bind:value={username} required autocomplete="off" placeholder="Operative Designation" class="bg-transparent border-none outline-none w-full text-slate-200 placeholder:text-slate-600 font-mono text-sm py-3.5 pr-4" type="text" />
				</div>
			</div>

			<!-- Password Field -->
			<div>
				<label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Access Code</label>
				<div class="relative flex items-center bg-slate-950 border border-slate-700 rounded-lg focus-within:border-cyan-500 focus-within:shadow-[0_0_10px_rgba(6,182,212,0.15)] transition-all overflow-hidden group">
					<div class="pl-4 pr-3 flex items-center justify-center text-slate-500 group-focus-within:text-cyan-400 transition-colors">
						<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
							<path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"></path>
						</svg>
					</div>
					<input bind:value={password} required placeholder="Matrix Handshake" class="bg-transparent border-none outline-none w-full text-slate-200 placeholder:text-slate-600 font-mono text-sm py-3.5 pr-4 tracking-widest" type="password" />
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-3 mt-4 mb-2">
			<TacticalButton type="submit" class="w-full flex items-center justify-center py-3.5">
				Authenticate Protocol
			</TacticalButton>
			
			<div class="flex items-center gap-3 w-full">
				<button type="button" class="w-1/2 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] uppercase tracking-widest hover:text-cyan-400 hover:border-cyan-500/50 transition-all cursor-pointer shadow-md">
					Sign Up
				</button>
				<button type="button" class="w-1/2 py-3 rounded-lg border border-slate-800 bg-transparent hover:bg-slate-800 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-slate-300 transition-all cursor-pointer">
					Reset Key
				</button>
			</div>
		</div>
	</form>

	<div class="absolute bottom-6 mx-auto text-slate-700 font-mono text-[10px] uppercase tracking-widest z-10 pointer-events-none drop-shadow-md">
		System Status: Operational • Build 2404
	</div>
</div>
