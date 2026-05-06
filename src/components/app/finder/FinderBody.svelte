<script lang="ts">
	import type { useWebContainer } from '$lib/hooks/use-webcontainer.svelte';
	import { createWebContainerService, createFinderService } from '$lib/factories/create-services';
	import { setWebContainerContext, setFinderContext } from '$lib/context/services';

	import FinderToolbar from './FinderToolbar.svelte';
	import FinderContent from './FinderContent.svelte';
	import FinderContextMenu from './FinderContextMenu.svelte';

	// ─── Props ───────────────────────────────────────────────────────────────────
	let props = $props<{
		wc: ReturnType<typeof useWebContainer>;
		onopen?: (path: string, content: string) => void;
	}>();

	// ─── Service Initialization & DI ──────────────────────────────────────────────────────────────
	// Create WebContainerService wrapper around the hook instance
	const wcService = (() => {
		const service = createWebContainerService();
		// Sync the hook's lifecycle to the service
		$effect(() => {
			if (props.wc.status === 'booting' && service.status !== 'booting') {
				service['boot']?.();
			}
		});
		return service;
	})();

	// Provide contexts synchronously so children can read them during SSR
	setWebContainerContext(wcService);

	// Create FinderService with DI and keep onopen reactive through props closure
	const finderService = createFinderService(wcService, (path: string, content: string) =>
		props.onopen?.(path, content)
	);
	setFinderContext(finderService);

	// ─── Keyboard ────────────────────────────────────────────────────────────────
	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape' && finderService) {
			finderService.clearContextMenu();
			finderService.clearCreating();
		}
	}
</script>

<svelte:window onkeydown={onKeyDown} onclick={() => finderService?.clearContextMenu()} />

<FinderToolbar onsearch={() => {}} />

{#if props.wc.status === 'idle'}
	<div class="empty">
		<p>WebContainer not started.</p>
		<button class="btn primary" onclick={() => props.wc.boot()}>Boot</button>
	</div>
{:else if props.wc.status === 'booting'}
	<div class="empty">
		<div class="spinner"></div>
		<p>Booting WebContainer…</p>
	</div>
{:else if props.wc.status === 'error'}
	<div class="empty error">
		<p>⚠ {props.wc.error}</p>
		<button class="btn" onclick={() => props.wc.boot()}>Retry</button>
	</div>
{:else if finderService}
	<div class="content">
		<FinderContent />
	</div>
{/if}

{#if finderService?.state.contextMenu}
	<FinderContextMenu
		x={finderService.state.contextMenu.x}
		y={finderService.state.contextMenu.y}
		name={finderService.state.contextMenu.node.name}
		ondelete={() =>
			finderService.state.contextMenu &&
			finderService.ctxDelete(finderService.state.contextMenu.node)}
	/>
{/if}

<style>
	.content {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.empty {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		color: var(--text-muted);
		font-size: 13px;

		&.error {
			color: #ef4444;
		}
	}

	.btn {
		height: 28px;
		padding: 0 12px;
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

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--border);
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
