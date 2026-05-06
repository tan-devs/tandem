<script lang="ts">
	import { Tabs } from 'bits-ui';
	import type { Snippet } from 'svelte';

	let {
		children,
		orientation,
		value = $bindable()
	}: {
		children: Snippet;
		orientation: 'horizontal' | 'vertical';
		value: string;
	} = $props();
</script>

<Tabs.Root {orientation} bind:value activationMode="manual">
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
		height: 100%;
	}
</style>
