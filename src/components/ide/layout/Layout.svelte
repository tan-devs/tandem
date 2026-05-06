<script lang="ts">
	import { Panels, Pane, Resizer } from '$components/primitives/resizeable';
	import type { Snippet } from 'svelte';

	let {
		children,
		leftsidebar,
		rightsidebar,
		direction
	}: {
		children: Snippet;
		leftsidebar: Snippet;
		rightsidebar?: Snippet;
		direction: 'horizontal' | 'vertical';
	} = $props();
</script>

<div class="container">
	<Panels {direction}>
		<Pane id="sidebar" defaultSize={20} minSize={15} collapsedSize={0} collapsible>
			{@render leftsidebar()}
		</Pane>
		<Resizer />
		<Pane id="main" defaultSize={65}>
			{@render children()}
		</Pane>
		{#if rightsidebar}
			<Resizer />
			<Pane id="secondary-sidebar" defaultSize={15} minSize={10} collapsedSize={0} collapsible>
				{@render rightsidebar()}
			</Pane>
		{/if}
	</Panels>
</div>

<style>
	.container {
		height: 100%;
	}
</style>
