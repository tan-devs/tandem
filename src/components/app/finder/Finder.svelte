<script lang="ts">
	import type { useWebContainer } from '$lib/hooks/use-webcontainer.svelte';
	import FinderBody from './FinderBody.svelte';

	// ─── Props ───────────────────────────────────────────────────────────────────
	let {
		wc,
		onopen
	}: {
		wc: ReturnType<typeof useWebContainer>;
		onopen?: (path: string, content: string) => void;
	} = $props();
</script>

<div class="finder" role="region" aria-label="File system browser">
	<div class="body">
		<FinderBody {wc} {onopen} />
	</div>
</div>

<style>
	.finder {
		--bg: #1e1e1e;
		--bg-button: #2d2d2d;
		--bg-hover: #3a3a3a;
		--border: rgba(255, 255, 255, 0.1);
		--text: #e0e0e0;
		--text-muted: #808080;
		--text-dim: #999;
		--accent: #0078d4;
		--accent-hover: #106ebe;
		--toolbar-bg: #252525;
		--sidebar-w: 160px;
		--preview-w: 280px;
		--c-dir: #60a5fa;
		--c-ts: #3178c6;
		--c-js: #f7df1e;
		--c-svelte: #ff3e00;
		--c-vue: #42b883;
		--c-json: #f59e0b;
		--c-md: #a3e635;
		--c-css: #38bdf8;
		--c-html: #f97316;
		--c-py: #3b82f6;
		--c-rs: #f97316;
		--c-img: #a78bfa;
		--c-file: #6b7280;

		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', ui-monospace, monospace;
		font-size: 13px;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 8px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 400px;
		color: var(--text);
		user-select: none;
	}

	.body {
		flex: 1;
		overflow: hidden;
		display: flex;
	}
</style>
