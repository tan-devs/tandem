<script lang="ts">
	import { Pane as PaneForge } from 'paneforge';
	import type { Snippet } from 'svelte';
	import { panels } from '$lib/stores/panels.svelte';

	let {
		id,
		children,
		defaultSize,
		collapsible = false,
		collapsedSize = 0
	}: {
		id: string;
		children: Snippet;
		defaultSize?: number;
		collapsible?: boolean;
		collapsedSize?: number;
	} = $props();

	let pane: PaneForge = $state(null!);

	$effect(() => {
		if (pane) panels.register(id, pane, defaultSize ?? 50);
		return () => panels.unregister(id);
	});
</script>

<PaneForge
	bind:this={pane}
	{defaultSize}
	{collapsible}
	{collapsedSize}
	onResize={(size) => panels.onResize(id, size)}
>
	{@render children()}
</PaneForge>
