<script lang="ts">
	import { Pane } from 'paneforge';
	import type { Snippet } from 'svelte';
	import { panels } from '$lib/stores/panel.svelte';

	let {
		id,
		children,
		defaultSize,
		collapsible = false,
		collapsedSize = 0,
		minSize
	}: {
		id: string;
		children: Snippet;
		defaultSize?: number;
		collapsible?: boolean;
		collapsedSize?: number;
		minSize?: number;
	} = $props();

	let pane: Pane = $state(null!);

	$effect(() => {
		if (pane) panels.register(id, pane, defaultSize ?? 50);
		return () => panels.unregister(id);
	});
</script>

<Pane
	bind:this={pane}
	{defaultSize}
	{collapsible}
	{collapsedSize}
	{minSize}
	onResize={(size) => panels.onResize(id, size)}
>
	{@render children()}
</Pane>
