<script lang="ts">
	let {
		path,
		content,
		loading
	}: {
		path: string;
		content: string;
		loading: boolean;
	} = $props();
</script>

<div class="pane">
	<div class="header">
		<span class="path">{path}</span>
	</div>
	{#if loading}
		<div class="center"><div class="spinner"></div></div>
	{:else}
		<pre class="content">{content}</pre>
	{/if}
</div>

<style>
	.pane {
		width: var(--preview-w);
		min-width: var(--preview-w);
		border-left: 1px solid var(--border);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.header {
		padding: 0 12px;
		height: 36px;
		border-bottom: 1px solid var(--border);
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.02);
		flex-shrink: 0;
	}

	.path {
		color: var(--text-dim);
		font-size: 10.5px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		letter-spacing: 0.02em;
	}

	.center {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.content {
		flex: 1;
		margin: 0;
		padding: 12px;
		overflow: auto;
		font-family: inherit;
		font-size: 11.5px;
		line-height: 1.65;
		color: var(--text-dim);
		white-space: pre;
		scrollbar-width: thin;
		scrollbar-color: var(--border) transparent;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border: 1.5px solid var(--border);
		border-top-color: var(--accent);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
