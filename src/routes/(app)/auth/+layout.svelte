<script lang="ts">
	import { createSvelteAuthClient } from '$lib/svelte/index.js';
	import { authClient } from '$lib/auth-client.js';
	import { Navbar } from '$components/app/navbar/index.js';
	let { children, data } = $props();
	// createSvelteAuthClient({ authClient });
	createSvelteAuthClient({ authClient, getServerState: () => data.authState });
</script>

<Navbar />
{@render children()}
