<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import type * as Monaco from 'monaco-editor';

	let container: HTMLDivElement;
	let editor: Monaco.editor.IStandaloneCodeEditor;
	let monaco: typeof Monaco;

	onMount(async () => {
		monaco = (await import('$lib/monaco')).default;

		editor = monaco.editor.create(container, {
			value: 'const message = "hello user"',
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
	});

	onDestroy(() => {
		monaco?.editor.getModels().forEach((m) => m.dispose());
		editor?.dispose();
	});
</script>

<div class="editor" bind:this={container}></div>

<style>
	.editor {
		width: 100%;
		height: 100%;
	}
</style>
