<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		children,
		variant = 'default',
		onclick,
		disabled = false
	}: {
		children: Snippet;
		variant?: 'default' | 'ghost' | 'danger';
		onclick?: () => void;
		disabled?: boolean;
	} = $props();
</script>

<button class="btn" data-variant={variant} {onclick} {disabled}>
	{@render children()}
</button>

<style>
	.btn {
		all: unset;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 0 12px;
		height: 30px;
		font-size: 13px;
		border-radius: 6px;
		cursor: pointer;
		border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
		transition: background 120ms ease;

		&:hover {
			background: color-mix(in srgb, currentColor 8%, transparent);
		}
		&:active {
			transform: scale(0.98);
		}
		&:disabled {
			opacity: 0.4;
			cursor: not-allowed;
		}

		&[data-variant='ghost'] {
			border-color: transparent;
		}
		&[data-variant='danger'] {
			color: red;
		}
	}
</style>
