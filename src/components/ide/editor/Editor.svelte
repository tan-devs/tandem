<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { SvelteMap } from 'svelte/reactivity';

	import EditorTabs from './EditorTabs.svelte';

	let tabs = $state([
		{
			id: '1',
			filename: 'index.ts',
			language: 'typescript',
			value: `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="text-scale" content="scale" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
`
		},
		{ id: '2', filename: 'App.jsx', language: 'typescript', value: '...' }
	]);

	const models = new SvelteMap<string, Monaco.editor.ITextModel>();
	let activeTabId = $state(tabs[0].id);
	function switchTab(id: string) {
		activeTabId = id;
		editor?.setModel(models.get(id)!);
	}

	import type * as Monaco from 'monaco-editor';

	let container: HTMLDivElement;
	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;
	let observer: ResizeObserver;

	onMount(async () => {
		monaco = (await import('$lib/services/client/monaco')).default;

		editor = monaco.editor.create(container!, {
			model: null,
			language: 'typescript',
			theme: 'vs-dark',
			fontSize: 13,
			lineHeight: 20,
			fontFamily: 'monospace',
			minimap: { enabled: false },
			scrollBeyondLastLine: false,
			renderLineHighlight: 'none',
			overviewRulerLanes: 0,
			scrollbar: { verticalScrollbarSize: 4, horizontalScrollbarSize: 4 },
			padding: { top: 12 }
		});
		observer = new ResizeObserver(() => editor.layout());
		observer.observe(container);
		for (const tab of tabs) {
			models.set(tab.id, monaco.editor.createModel(tab.value, tab.language));
		}
		switchTab(activeTabId);
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((m) => m.dispose());
		editor?.dispose();
	});
</script>

<EditorTabs {tabs} {activeTabId} onTabChange={switchTab} />

<div class="editor" bind:this={container}></div>

<style>
	.editor {
		width: 100%;
		height: 100%;
	}
</style>
