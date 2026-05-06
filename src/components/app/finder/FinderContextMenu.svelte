<script lang="ts">
	let {
		x,
		y,
		name,
		ondelete
	}: {
		x: number;
		y: number;
		name: string;
		ondelete: () => void;
	} = $props();
</script>

<div class="menu" style="left:{x}px; top:{y}px" role="menu">
	<button role="menuitem" onclick={ondelete}>
		Delete "{name}"
	</button>
</div>

<style>
	.menu {
		position: fixed;
		z-index: 999;
		background: #1c1c1f;
		border: 1px solid var(--border);
		border-radius: 6px;
		padding: 4px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
		min-width: 160px;

		button {
			display: block;
			width: 100%;
			text-align: left;
			background: none;
			border: none;
			color: #ef4444;
			font-family: inherit;
			font-size: 12px;
			padding: 6px 10px;
			border-radius: 4px;
			cursor: pointer;
			&:hover {
				background: rgba(239, 68, 68, 0.12);
			}
		}
	}
</style>
