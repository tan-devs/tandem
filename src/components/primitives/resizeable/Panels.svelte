<script lang="ts">
	import { PaneGroup } from 'paneforge';
	import type { Snippet } from 'svelte';

	let {
		children,
		child,
		direction
	}: {
		children?: Snippet;
		child?: Snippet<[{ props: Record<string, unknown> }]>;
		direction: 'horizontal' | 'vertical';
	} = $props();

	const Props = $derived({ direction });
</script>

{#if child}
	{@render child({ props: Props })}
{:else}
	<PaneGroup {direction}>
		{@render children?.()}
	</PaneGroup>
{/if}

<style>
	:global([data-pane-group]) {
		height: 100%;
		width: 100%;
	}
</style>
