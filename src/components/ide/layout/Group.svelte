<script lang="ts">
	import { Panels, Pane, Resizer } from '$components/primitives/resizeable';
	import type { Snippet } from 'svelte';

	let { editor, terminal }: { editor: Snippet; terminal: Snippet } = $props();
</script>

<Panels direction="vertical">
	<Pane id="editor" defaultSize={70}>
		{@render editor()}
	</Pane>
	<Resizer />
	<Pane id="panel" defaultSize={30} collapsible>
		{@render terminal()}
	</Pane>
</Panels>
