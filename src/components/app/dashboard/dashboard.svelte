<script lang="ts">
	// ─── Framework ────────────────────────────────────────────────
	import { untrack } from 'svelte';
	import { useAuth } from '$lib/svelte/index.js';
	import { useWebContainer } from '$lib/hooks/use-webcontainer.svelte';
	import { Finder } from '$components/app/finder';

	// ─── Domain modules ───────────────────────────────────────────
	import { createCurrentUserQuery } from './queries';
	import { selectUser, selectIsReady } from './selectors.svelte';
	import { createHandlers } from './handlers';

	// ─── Props (server-injected data) ─────────────────────────────
	let { data } = $props();

	// ─── Auth ─────────────────────────────────────────────────────
	const auth = useAuth();

	// ─── Queries ──────────────────────────────────────────────────
	const currentUserResponse = createCurrentUserQuery({
		isAuthenticated: () => auth.isAuthenticated,
		initialUser: untrack(() => data.currentUser)
	});

	// ─── Selectors ($derived here so data.currentUser stays reactive)
	let user = $derived(selectUser(currentUserResponse.data, data.currentUser));
	let isReady = $derived(selectIsReady(user));

	// ─── Bootstrapper ─────────────────────────────────────────────
	const wc = useWebContainer();
	$effect(() => {
		wc.boot();
	});

	// ─── Handlers ─────────────────────────────────────────────────
	const { handleSignOut, handleOpen } = createHandlers({
		onError: (msg) => console.error(msg)
	});
</script>

<div class="dashboard">
	<header>
		<div class="user-info">
			<div class="avatar">{user?.name?.[0]?.toUpperCase() ?? '?'}</div>
			<div>
				<h2>{user?.name}</h2>
				<p>{user?.email}</p>
			</div>
			<!-- fix: was signOut, now handleSignOut -->
			<button disabled={!isReady} onclick={handleSignOut}>Sign out</button>
		</div>
	</header>
	<div class="finder"><Finder {wc} onopen={handleOpen} /></div>
</div>
