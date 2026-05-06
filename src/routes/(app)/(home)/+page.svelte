<script lang="ts">
	import { resolve } from '$app/paths';
	import { useAuth } from '$lib/svelte/index.js';
	import { Dashboard } from '$components/app/dashboard/index.js';

	let { data } = $props();

	// Auth state store
	const auth = useAuth();

	const isLoading = $derived(auth.isLoading);
	const isAuthenticated = $derived(auth.isAuthenticated);
</script>

<section>
	{#if isLoading}
		<div class="loading">Loading...</div>
	{:else if isAuthenticated}
		<!-- Dashboard -->

		<Dashboard {data} />
	{:else}
		<!-- Landing -->

		<main>
			<h1>Welcome to Tandem</h1>
			<p>Visit <a href="https://github.com">github</a> to read the documentation</p>
			<div class="actions">
				<a href={resolve('/auth')}>sign-up or login</a>
				<a href={resolve('/repo')}>go to workspace</a>
			</div>
		</main>
	{/if}
</section>

<style>
	section {
		width: 100%;
		height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Loading */
	.loading {
		color: light-dark(#aaa, #555);
		font-size: 0.875rem;
	}

	/* Landing */
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		text-align: center;

		h1 {
			font-size: 1.5rem;
			font-weight: 600;
			margin: 0;
		}

		p {
			margin: 0;
			color: light-dark(#666, #999);
			font-size: 0.9rem;
		}

		.actions {
			display: flex;
			gap: 1rem;
			margin-top: 0.5rem;

			a {
				padding: 0.4rem 1rem;
				border-radius: 6px;
				font-size: 0.875rem;
				text-decoration: none;

				&:first-child {
					background: light-dark(#111, #eee);
					color: light-dark(#fff, #111);
				}

				&:last-child {
					border: 0.5px solid light-dark(rgba(0, 0, 0, 0.15), rgba(255, 255, 255, 0.15));
					color: inherit;
				}
			}
		}
	}
</style>
