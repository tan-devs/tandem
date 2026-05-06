<script lang="ts">
	import FinderRow from './FinderRow.svelte';
	import FinderPreview from './FinderPreview.svelte';
	import FinderCreateRow from './FinderCreateRow.svelte';
	import { getFinderContext } from '$lib/context/services';

	const finderService = getFinderContext();
	const finderState = finderService.state;

	const SIDEBAR_ITEMS = [
		{ id: 'root', label: 'WebContainer', icon: '📦', path: '/' },
		{ id: 'recents', label: 'Recents', icon: '🕐', path: null }
	];
</script>

<aside class="sidebar">
	{#each SIDEBAR_ITEMS as item (item.id)}
		<button
			class="sidebar-item"
			class:selected={finderState.sidebarSelected === item.id}
			onclick={() => finderService.sidebarClick(item)}
		>
			<span class="sidebar-icon">{item.icon}</span>
			<span class="sidebar-label">{item.label}</span>
		</button>
	{/each}
</aside>

<div class="main">
	<div class="list" role="listbox" aria-label="Files and folders">
		{#each finderState.currentChildren as node (node.path)}
			<FinderRow
				{node}
				selected={finderState.selected === node.path}
				onclick={() => finderService.selectNode(node)}
				ondblclick={() => finderService.openFile(node)}
				oncontextmenu={(e) => finderService.onContextMenu(e, node)}
			/>
		{/each}

		{#if finderState.creating}
			<FinderCreateRow
				creating={finderState.creating}
				onCommitCreate={finderService.commitCreate}
				onCancelCreate={finderService.clearCreating}
				onCreateNameInput={finderService.setCreateName}
			/>
		{/if}
	</div>

	{#if finderState.preview}
		<FinderPreview
			path={finderState.preview.path}
			content={finderState.preview.content}
			loading={finderState.preview.loading}
		/>
	{/if}
</div>

<style>
	.sidebar {
		width: var(--sidebar-w);
		min-width: var(--sidebar-w);
		border-right: 1px solid var(--border);
		background: rgba(0, 0, 0, 0.2);
		padding: 8px 0;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--border) transparent;
	}

	.sidebar-item {
		width: 100%;
		height: 28px;
		padding: 0 12px;
		display: flex;
		align-items: center;
		gap: 8px;
		background: none;
		border: none;
		color: var(--text-dim);
		cursor: pointer;
		font-size: 12px;
		transition:
			background 0.12s,
			color 0.12s;
		margin: 0 6px;
		border-radius: 4px;

		&:hover {
			background: rgba(255, 255, 255, 0.06);
			color: var(--text);
		}

		&.selected {
			background: var(--accent);
			color: white;
		}
	}

	.sidebar-icon {
		width: 16px;
		text-align: center;
		flex-shrink: 0;
		font-size: 14px;
	}

	.sidebar-label {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.main {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.list {
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--border) transparent;
		padding: 4px 0;
	}
</style>
