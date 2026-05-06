<script lang="ts">
	import { browser } from '$app/environment';
	import { Sun, Moon } from '@lucide/svelte';

	const prefersDark = browser ? window.matchMedia('(prefers-color-scheme: dark)') : null;

	let theme = $state(
		browser ? (localStorage.getItem('theme') ?? (prefersDark!.matches ? 'dark' : 'light')) : 'light'
	);

	if (browser) {
		prefersDark!.addEventListener('change', (e) => {
			if (!localStorage.getItem('theme')) {
				theme = e.matches ? 'dark' : 'light';
			}
		});
	}

	function toggleTheme() {
		theme = theme === 'light' ? 'dark' : 'light';
		localStorage.setItem('theme', theme);
	}

	$effect(() => {
		if (!browser) return;
		document.documentElement.setAttribute('data-theme', theme);
		document.documentElement.style.colorScheme = theme;
	});
</script>

<button onclick={toggleTheme} class="theme-btn" aria-label="Toggle theme">
	{#if theme === 'light'}
		<Sun size={24} />
	{:else}
		<Moon size={24} />
	{/if}
</button>

<style>
	.theme-btn {
		background: none;

		border: 1px solid light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.15));
		border-radius: 2rem;

		/* svelte-ignore css_unknown_property */
		corner-shape: squircle;

		aspect-ratio: 1;
		padding: 8px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;

		&:hover {
			background-color: light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.1));
		}

		@media (hover: hover) {
			&:hover {
				transform: scale(1.05);
			}
		}

		&:active {
			transform: scale(0.95);
		}
	}
</style>
