<script lang="ts">
	import { authClient } from '$lib/auth-client.js';
	import { api } from '$convex/functions/_generated/api.js';
	import { useQuery } from '@mmailaender/convex-svelte';
	import { useAuth } from '$lib/svelte/index.js';

	let { data } = $props();

	// Auth state store
	const auth = useAuth();
	const isLoading = $derived(auth.isLoading);
	const isAuthenticated = $derived(auth.isAuthenticated);

	$inspect(auth.isLoading, 'isLoading');
	$inspect(auth.isAuthenticated, 'isAuthenticated');

	const currentUserResponse = useQuery(
		api.auth.getCurrentUser,
		() => (auth.isAuthenticated ? {} : 'skip'),
		() => ({
			initialData: data.currentUser,
			keepPreviousData: true
		})
	);
	let user = $derived(currentUserResponse.data);
	$inspect(currentUserResponse, 'currentUserResponse');
	$inspect(user, 'user');

	// Sign in/up form state
	let showSignIn = $state(true);
	let name = $state('');
	let email = $state('');
	let password = $state('');

	// Handle form submission
	async function handlePasswordSubmit(event: Event) {
		event.preventDefault();

		try {
			if (showSignIn) {
				await authClient.signIn.email(
					{ email, password },
					{
						onError: (ctx) => {
							alert(ctx.error.message);
						}
					}
				);
			} else {
				await authClient.signUp.email(
					{ name, email, password },
					{
						onError: (ctx) => {
							alert(ctx.error.message);
						}
					}
				);
			}
		} catch (error) {
			console.error('Authentication error:', error);
		}
	}

	async function handleGitHub() {
		await authClient.signIn.social({ provider: 'github' });
	}

	// Sign out function
	async function signOut() {
		const result = await authClient.signOut();
		if (result.error) {
			console.error('Sign out error:', result.error);
		}
	}

	// Toggle between sign in and sign up
	function toggleSignMode() {
		showSignIn = !showSignIn;
		// Clear form fields when toggling
		name = '';
		email = '';
		password = '';
	}

	// Demo: Fetch access token
	let accessToken = $state<string | null>(null);
	let tokenLoading = $state(false);

	async function fetchToken() {
		tokenLoading = true;
		try {
			const token = await auth.fetchAccessToken({ forceRefreshToken: true });
			accessToken = token;
		} catch (error) {
			console.error('Error fetching access token:', error);
			accessToken = 'Error fetching token';
		} finally {
			tokenLoading = false;
		}
	}
</script>

<section>
	<main>
		{#if isLoading}
			<div>Loading...</div>
		{:else if !isAuthenticated}
			<h2>
				{showSignIn ? 'Sign In' : 'Sign Up'}
			</h2>

			<form onsubmit={handlePasswordSubmit}>
				{#if !showSignIn}
					<input bind:value={name} placeholder="Name" required />
				{/if}
				<input type="email" bind:value={email} placeholder="Email" required />
				<input type="password" bind:value={password} placeholder="Password" required />
				<button type="submit">
					{showSignIn ? 'Sign in' : 'Sign up'}
				</button>
			</form>

			<p>
				{showSignIn ? "Don't have an account? " : 'Already have an account? '}
				<button type="button" onclick={toggleSignMode}>
					{showSignIn ? 'Sign up' : 'Sign in'}
				</button>
			</p>

			<div class="divider">or</div>

			<button class="btn-gh" onclick={handleGitHub}>
				<svg viewBox="0 0 24 24"
					><path
						d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
					/></svg
				>
				Continue with GitHub
			</button>
		{:else if isAuthenticated}
			<div>
				<div>
					Hello {user?.name}!
				</div>

				<!-- Demo: Access Token Section -->
				<div>
					<h3>Access Token Demo</h3>
					<button onclick={fetchToken} disabled={tokenLoading}>
						{tokenLoading ? 'Fetching...' : 'Fetch Access Token'}
					</button>
					{#if accessToken}
						<div>
							{accessToken.length > 50 ? accessToken.substring(0, 50) + '...' : accessToken}
						</div>
					{/if}
				</div>

				<button onclick={signOut}> Sign out </button>
			</div>
		{/if}
	</main>
</section>

<style>
	section {
		width: 100%;
		height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	main {
		background: var(--bg-color);
		border: 0.5px solid light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.15));
		border-radius: 12px;
		padding: 2rem;
		width: 100%;
		max-width: 360px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.divider {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 0.8125rem;
		color: light-dark(#aaa, #555);

		&::before,
		&::after {
			content: '';
			flex: 1;
			height: 0.5px;
			background: light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.15));
		}
	}

	.btn-gh {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 0.5rem;
		font-size: 0.875rem;

		svg {
			width: 16px;
			height: 16px;
			fill: var(--text-color);
			flex-shrink: 0;
		}
	}
</style>
