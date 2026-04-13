<script lang="ts">
	import type { Snippet } from 'svelte';

	type AspectRatio = 'auto' | 'square' | 'video' | 'portrait';
	type CornerShape = 'rounded' | 'sharp' | 'squircle' | 'pill';
	type Variant = 'default' | 'ghost' | 'outlined';

	let {
		children,
		header,
		footer,
		aspect = 'auto',
		corners = 'rounded',
		variant = 'default',
		onclick
	}: {
		children: Snippet;
		header?: Snippet;
		footer?: Snippet;
		aspect?: AspectRatio;
		corners?: CornerShape;
		variant?: Variant;
		onclick?: () => void;
	} = $props();

	const aspectMap: Record<AspectRatio, string> = {
		auto: 'auto',
		square: '1 / 1',
		video: '16 / 9',
		portrait: '3 / 4'
	};

	const radiusMap: Record<CornerShape, string> = {
		sharp: '0px',
		rounded: '10px',
		squircle: '10px',
		pill: '999px'
	};

	const isInteractive = $derived(!!onclick);
</script>

{#if isInteractive}
	<button
		class="card"
		data-variant={variant}
		style:aspect-ratio={aspectMap[aspect]}
		style:border-radius={radiusMap[corners]}
		style:--corner-shape={corners === 'squircle' ? 'squircle' : 'inherit'}
		{onclick}
	>
		{#if header}<div class="header">{@render header()}</div>{/if}
		<div class="body">{@render children()}</div>
		{#if footer}<div class="footer">{@render footer()}</div>{/if}
	</button>
{:else}
	<article
		class="card"
		data-variant={variant}
		style:aspect-ratio={aspectMap[aspect]}
		style:border-radius={radiusMap[corners]}
		style:--corner-shape={corners === 'squircle' ? 'squircle' : 'inherit'}
	>
		{#if header}<div class="header">{@render header()}</div>{/if}
		<div class="body">{@render children()}</div>
		{#if footer}<div class="footer">{@render footer()}</div>{/if}
	</article>
{/if}

<style>
	.card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 10px;
		text-align: left;
		width: 100%;
		/* svelte-ignore css_unknown_property */
		corner-shape: var(--corner-shape);
		transition:
			background 120ms ease,
			transform 120ms ease;

		&[data-variant='default'] {
			background: light-dark(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.04));
			border: 1px solid light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.08));
		}

		&[data-variant='ghost'] {
			background: transparent;
			border: none;
		}

		&[data-variant='outlined'] {
			background: transparent;
			border: 1px solid light-dark(rgba(0, 0, 0, 0.15), rgba(255, 255, 255, 0.15));
		}

		button& {
			cursor: pointer;

			@media (hover: hover) {
				&:hover {
					background: light-dark(rgba(0, 0, 0, 0.03), rgba(255, 255, 255, 0.07));
					transform: translateY(-1px);
				}
			}

			&:active {
				transform: scale(0.99);
			}

			&:focus-visible {
				outline: 2px solid light-dark(rgba(0, 0, 0, 0.4), rgba(255, 255, 255, 0.4));
				outline-offset: 2px;
			}
		}
	}

	.header {
		padding: 1rem 1rem 0.75rem;
		font-size: 13px;
		font-weight: 500;
		opacity: 0.5;
		border-bottom: 1px solid light-dark(rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0.06));
	}

	.body {
		flex: 1;
		padding: 1rem;
	}

	.footer {
		padding: 0.75rem 1rem;
		font-size: 12px;
		opacity: 0.5;
		border-top: 1px solid light-dark(rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0.06));
	}
</style>
