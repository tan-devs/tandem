<script lang="ts">
	type Props = {
		creating: { kind: 'file' | 'dir'; name: string };
		onCommitCreate: () => void;
		onCancelCreate: () => void;
		onCreateNameInput: (name: string) => void;
	};

	// ─── Props ───────────────────────────────────────────────────────────────────
	let { creating, onCommitCreate, onCancelCreate, onCreateNameInput }: Props = $props();
</script>

<div class="creating-row">
	<span class="create-icon">{creating.kind === 'dir' ? '📁' : '📄'}</span>
	<input
		class="create-input"
		type="text"
		placeholder={creating.kind === 'dir' ? 'folder name' : 'file name'}
		value={creating.name}
		oninput={(e) => onCreateNameInput((e.currentTarget as HTMLInputElement).value)}
		onblur={onCommitCreate}
		onkeydown={(e) => {
			if (e.key === 'Enter') onCommitCreate();
			if (e.key === 'Escape') onCancelCreate();
		}}
	/>
</div>

<style>
	.creating-row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 0 12px;
		height: 24px;
		background: rgba(255, 255, 255, 0.03);
		margin: 0 6px;
		border-radius: 2px;
	}

	.create-icon {
		font-size: 14px;
		width: 16px;
		text-align: center;
		flex-shrink: 0;
		color: var(--text-dim);
	}

	.create-input {
		flex: 1;
		background: transparent;
		border: 1px solid var(--accent);
		border-radius: 2px;
		color: var(--text);
		font-family: inherit;
		font-size: 12px;
		padding: 2px 4px;
		outline: none;
		min-width: 0;
	}
</style>
