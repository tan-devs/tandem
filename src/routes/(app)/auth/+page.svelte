<script lang="ts">
	import { authClient } from '$lib/auth-client.js';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let tab: 'signin' | 'signup' = $state('signin');

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleSignIn() {
		error = '';
		loading = true;
		const { error: err } = await authClient.signIn.email({ email, password });
		loading = false;
		if (err) {
			error = err.message ?? 'Sign in failed';
		} else {
			goto(resolve('/'));
		}
	}

	async function handleSignUp() {
		error = '';
		loading = true;
		const { error: err } = await authClient.signUp.email({ email, password, name });
		loading = false;
		if (err) {
			error = err.message ?? 'Sign up failed';
		} else {
			goto(resolve('/'));
		}
	}

	async function handleGitHub() {
		await authClient.signIn.social({ provider: 'github' });
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

{#if error}
	<p>{error}</p>
{/if}
