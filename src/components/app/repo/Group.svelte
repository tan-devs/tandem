<script lang="ts">
	import { Panels, Pane, Resizer } from '$components/primitives/resizeable';
	import type { Snippet } from 'svelte';

	let { editor, terminal }: { editor: Snippet; terminal: Snippet } = $props();
</script>

<Panels direction="vertical">
	<Pane id="editor" defaultSize={50}>
		{@render editor()}
	</Pane>
	<Resizer />
	<Pane id="terminal" defaultSize={50}>
		{@render terminal()}
	</Pane>
</Panels>
