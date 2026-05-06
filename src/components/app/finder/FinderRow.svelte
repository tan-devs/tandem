<script lang="ts">
	import type { FinderNode } from '$types/finder';
	import { selectNodeIcon, selectNodeColor } from './selectors.svelte';

	let {
		node,
		selected = false,
		onclick,
		ondblclick,
		oncontextmenu
	}: {
		node: FinderNode;
		selected?: boolean;
		onclick: () => void;
		ondblclick: () => void;
		oncontextmenu: (e: MouseEvent) => void;
	} = $props();

	const icon = $derived(selectNodeIcon(node));
	const color = $derived(selectNodeColor(node));
</script>

<div
	class="row"
	class:selected
	role="option"
	aria-selected={selected}
	tabindex="0"
	{onclick}
	{ondblclick}
	{oncontextmenu}
	onkeydown={(e) => e.key === 'Enter' && onclick()}
>
	<span class="icon" style="color: {color}">{icon}</span>
	<span class="name">{node.name}</span>
	{#if node.kind === 'dir'}
		<span class="chevron">›</span>
	{/if}
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 12px;
		height: 24px;
		cursor: pointer;
		transition: background 0.08s;
		outline: none;
		font-size: 13px;
		border-radius: 2px;
		margin: 0 6px;

		&:hover {
			background: rgba(255, 255, 255, 0.08);
		}
		&.selected {
			background: var(--accent);
			.name {
				color: white;
			}
			.chevron {
				color: rgba(255, 255, 255, 0.7);
			}
		}
		&:focus-visible {
			box-shadow: inset 0 0 0 1px var(--accent);
		}
	}

	.icon {
		font-size: 14px;
		width: 16px;
		text-align: center;
		flex-shrink: 0;
		line-height: 1;
	}

	.name {
		flex: 1;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--text);
	}

	.chevron {
		color: var(--text-muted);
		font-size: 12px;
		line-height: 1;
		flex-shrink: 0;
		margin-left: auto;
	}
</style>
