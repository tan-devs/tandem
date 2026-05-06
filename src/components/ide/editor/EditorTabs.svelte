<script lang="ts">
	import { Tabs } from 'bits-ui';

	type Tab = { id: string; filename: string };
	let {
		tabs,
		activeTabId,
		onTabChange
	}: { tabs: Tab[]; activeTabId: string; onTabChange: (id: string) => void } = $props();
</script>

<Tabs.Root value={activeTabId} onValueChange={onTabChange}>
	<Tabs.List class="tab-list">
		{#each tabs as tab (tab)}
			<Tabs.Trigger value={tab.id} class="tab">{tab.filename}</Tabs.Trigger>
		{/each}
	</Tabs.List>
</Tabs.Root>

<style>
	:global(.tab-list) {
		display: flex;
		background: #252526;
		border-bottom: 1px solid #1e1e1e;
		overflow-x: auto;
		scrollbar-width: none;
		height: 35px;
	}

	:global(.tab) {
		display: flex;
		align-items: center;
		padding: 0 12px;
		font-size: 12px;
		font-family: monospace;
		color: #969696;
		background: #2d2d2d;
		border: none;
		border-right: 1px solid #1e1e1e;
		cursor: pointer;
		white-space: nowrap;
	}

	:global(.tab[data-state='active']) {
		background: #1e1e1e;
		color: #cccccc;
		border-top: 1px solid #007acc;
	}

	:global(.tab:hover) {
		color: #cccccc;
	}
</style>
