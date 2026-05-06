<script lang="ts">
	import { Dialog, type WithoutChild } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		children,
		trigger,
		open = $bindable(false),
		contentProps,
		onOpenChange
	}: {
		children: Snippet;
		trigger: Snippet;
		open?: boolean;
		contentProps?: WithoutChild<Dialog.ContentProps>;
		onOpenChange?: (open: boolean) => void;
	} = $props();
</script>

<Dialog.Root bind:open {onOpenChange}>
	<Dialog.Trigger class="dialog-trigger">
		{@render trigger()}
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay class="overlay" />
		<Dialog.Content class="content" {...contentProps}>
			{@render children()}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
	:global(.dialog-trigger) {
		all: unset;
		display: contents;
	}

	:global(.overlay) {
		position: fixed;
		inset: 0;
		background: color-mix(in srgb, black 40%, transparent);
	}

	:global(.content) {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: var(--color-bg);
		border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
		border-radius: 10px;
		padding: 1.5rem;
		min-width: 320px;
	}
</style>
