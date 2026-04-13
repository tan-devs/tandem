<script lang="ts">
	import { Panels, Pane, Resizer } from '$components/primitives/resizeable';
	import type { Snippet } from 'svelte';

	let {
		children,
		sidebar,
		direction
	}: { children: Snippet; sidebar: Snippet; direction: 'horizontal' | 'vertical' } = $props();
</script>

<div class="container">
	<Panels {direction}>
		<Pane id="sidebar" defaultSize={25}>
			{@render sidebar()}
		</Pane>
		<Resizer />
		<Pane id="repo" defaultSize={75}>
			{@render children()}
		</Pane>
	</Panels>
</div>

<style>
	.container {
		height: 100%;
	}
</style>
