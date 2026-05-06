<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Terminal } from '@xterm/xterm';
	import { FitAddon } from '@xterm/addon-fit';
	import '@xterm/xterm/css/xterm.css';

	let container: HTMLDivElement;
	let term: Terminal;
	let fitAddon: FitAddon;

	onMount(() => {
		term = new Terminal({
			fontSize: 13,
			fontFamily: 'monospace',
			theme: { background: '#1e1e1e', foreground: '#d4d4d4', cursor: '#d4d4d4' },
			cursorBlink: true
		});

		fitAddon = new FitAddon();
		term.loadAddon(fitAddon);
		term.open(container);
		fitAddon.fit();

		term.onKey(({ key, domEvent }) => {
			if (domEvent.key === 'Enter') {
				term.writeln('');
				term.write('\x1b[32m$\x1b[0m ');
			} else if (domEvent.key === 'Backspace') {
				term.write('\b \b');
			} else {
				term.write(key);
			}
		});

		const observer = new ResizeObserver(() => fitAddon.fit());
		observer.observe(container);

		return () => observer.disconnect();
	});

	onDestroy(() => term?.dispose());
</script>

<div class="terminal" bind:this={container}></div>

<style>
	.terminal {
		width: 100%;
		height: 100%;
		padding: 8px;
		box-sizing: border-box;
		background: #1e1e1e;
	}

	:global(.xterm, .xterm-viewport, .xterm-screen) {
		width: 100% !important;
		height: 100% !important;
	}
</style>
