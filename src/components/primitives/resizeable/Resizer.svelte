<script lang="ts">
	import { PaneResizer } from 'paneforge';
</script>

<PaneResizer></PaneResizer>

<style>
	:global([data-pane-resizer]) {
		flex-shrink: 0;
		background: color-mix(in srgb, currentColor 15%, transparent);
		transition: background 150ms ease;

		&:hover,
		&[data-resize-handle-state='drag'] {
			background: color-mix(in srgb, currentColor 40%, transparent);
		}
	}

	:global([data-pane-group][data-direction='horizontal'] > [data-pane-resizer]) {
		width: 1px;
		cursor: col-resize;

		&:hover,
		&[data-resize-handle-state='drag'] {
			width: 2px;
		}
	}

	:global([data-pane-group][data-direction='vertical'] > [data-pane-resizer]) {
		height: 1px;
		cursor: row-resize;

		&:hover,
		&[data-resize-handle-state='drag'] {
			height: 2px;
		}
	}
</style>
