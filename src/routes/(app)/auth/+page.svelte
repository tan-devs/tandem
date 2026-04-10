<script lang="ts">
	import { authClient } from '$lib/auth-client.js';

	let tab: 'signin' | 'signup' = $state('signin');

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let error = $state('');
	let loading = $state(false);
	let token = $state('');

	async function handleSignIn() {
		error = '';
		loading = true;
		const { data, error: err } = await authClient.signIn.email({ email, password });
		loading = false;
		if (err) {
			error = err.message ?? 'Sign in failed';
		} else {
			token = data?.token ?? '';
		}
	}

	async function handleSignUp() {
		error = '';
		loading = true;
		const { data, error: err } = await authClient.signUp.email({ email, password, name });
		loading = false;
		if (err) {
			error = err.message ?? 'Sign up failed';
		} else {
			token = data?.token ?? '';
		}
	}

	async function handleGitHub() {
		const { data } = await authClient.signIn.social({ provider: 'github' });
		if (data && 'token' in data) {
			token = data.token;
		}
	}

	async function handleSignOut() {
		await authClient.signOut();
		token = '';
	}
</script>

<div>
	<button onclick={() => (tab = 'signin')}>Sign in</button>
	<button onclick={() => (tab = 'signup')}>Sign up</button>
</div>

{#if tab === 'signin'}
	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSignIn();
		}}
	>
		<input type="email" placeholder="Email" bind:value={email} required />
		<input type="password" placeholder="Password" bind:value={password} required />
		<button type="submit" disabled={loading}>Sign in</button>
	</form>
{:else}
	<form
		onsubmit={(e) => {
			e.preventDefault();
			handleSignUp();
		}}
	>
		<input type="text" placeholder="Name" bind:value={name} required />
		<input type="email" placeholder="Email" bind:value={email} required />
		<input type="password" placeholder="Password" bind:value={password} required />
		<button type="submit" disabled={loading}>Sign up</button>
	</form>
{/if}

<button onclick={handleGitHub}>Continue with GitHub</button>
<button onclick={handleSignOut}>Sign out</button>

{#if token}
	<input type="text" readonly value={token} />
{/if}

{#if error}
	<p>{error}</p>
{/if}
