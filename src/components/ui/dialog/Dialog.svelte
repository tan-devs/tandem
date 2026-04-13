<script lang="ts">
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		children,
		trigger,
		open = $bindable(false)
	}: {
		children: Snippet;
		trigger: Snippet;
		open?: boolean;
	} = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{#snippet child({ props })}
			<span {...props}>{@render trigger()}</span>
		{/snippet}
	</Dialog.Trigger>

	<Dialog.Portal>
		<Dialog.Overlay class="overlay" />
		<Dialog.Content class="content">
			{@render children()}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

<style>
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
