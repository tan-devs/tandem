<script lang="ts">
	import { selectWcView } from './selectors.svelte';
	import { getFinderContext, getWebContainerContext } from '$lib/context/services';

	let { onsearch }: { onsearch?: (query: string) => void } = $props();

	const finderService = getFinderContext();
	const wcService = getWebContainerContext();
	const finderState = finderService.state;
	const view = $derived(selectWcView(wcService.status));
	let searchQuery = $state.raw('');
</script>

<div class="toolbar">
	<div class="left">
		<button class="nav-btn" onclick={finderService.back} title="Back">←</button>
		<button class="nav-btn" onclick={finderService.forward} title="Forward">→</button>
	</div>

	<div class="center">
		<div class="path-display">{finderState.selected}</div>
	</div>

	<div class="right">
		<input
			type="text"
			class="search"
			placeholder="Search"
			bind:value={searchQuery}
			onchange={() => onsearch?.(searchQuery)}
		/>
		<div class="spacer"></div>
		{#if view === 'idle'}
			<button class="btn primary" onclick={() => wcService.boot()}>Boot</button>
		{:else if view === 'ready'}
			<button class="btn" onclick={() => finderService.startCreate('file')} title="New File"
				>+</button
			>
			<button class="btn" onclick={() => finderService.startCreate('dir')} title="New Folder"
				>📁</button
			>
			<button class="btn" onclick={() => wcService.refresh()} title="Refresh">↺</button>
		{/if}
	</div>
</div>

<style>
	.toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 12px;
		height: 44px;
		border-bottom: 1px solid var(--border);
		background: var(--toolbar-bg);
		flex-shrink: 0;
		gap: 12px;
	}

	.left {
		display: flex;
		gap: 4px;
	}

	.nav-btn {
		width: 28px;
		height: 28px;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--bg-button);
		color: var(--text);
		cursor: pointer;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.12s;
		&:hover {
			background: var(--bg-hover);
		}
	}

	.center {
		flex: 1;
	}

	.path-display {
		font-size: 12px;
		color: var(--text-dim);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.right {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.search {
		width: 140px;
		padding: 4px 8px;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--bg-button);
		color: var(--text);
		font-size: 12px;
		font-family: inherit;
		outline: none;
		transition: background 0.12s;
		&:focus {
			background: rgba(255, 255, 255, 0.08);
		}
		&::placeholder {
			color: var(--text-muted);
		}
	}

	.spacer {
		width: 1px;
		height: 20px;
		background: var(--border);
	}

	.btn {
		height: 28px;
		padding: 0 8px;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--bg-button);
		color: var(--text-dim);
		font-size: 12px;
		font-family: inherit;
		cursor: pointer;
		transition:
			background 0.12s,
			color 0.12s;
		display: flex;
		align-items: center;
		&:hover {
			background: var(--bg-hover);
			color: var(--text);
		}
		&.primary {
			background: var(--accent);
			color: white;
			border-color: var(--accent);
			&:hover {
				background: var(--accent-hover);
			}
		}
	}
</style>
