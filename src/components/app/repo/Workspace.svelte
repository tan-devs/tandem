<script lang="ts">
	import { Tabs } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		children,
		orientation,
		value
	}: {
		children: Snippet;
		orientation: 'horizontal' | 'vertical';
		value: string;
	} = $props();
</script>

<!--
    One Tabs.Root wraps everything.
    We use `child` to make it render as <main> instead of a <div>,
    so it participates in the section grid correctly.
  -->
<Tabs.Root {orientation} {value}>
	{#snippet child({ props })}
		<main {...props}>
			{@render children()}
		</main>
	{/snippet}
</Tabs.Root>

<style>
	main {
		display: grid;
		grid-template-columns: auto 1fr;
		overflow: hidden;
		height: 100%; /* add this */
	}
</style>
