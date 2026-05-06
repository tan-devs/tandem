<script>
	import {
		GitBranch,
		AlertCircle,
		AlertTriangle,
		ChevronsUp,
		ChevronsDown,
		Code2,
		BarChart2
	} from '@lucide/svelte';
</script>

<footer>
	<div class="sb-left">
		<span class="sb-item branch">
			<GitBranch size={14} />
			main
		</span>
		<span class="sb-item">
			<AlertCircle size={14} />
			0
			<AlertTriangle size={14} />
			0
		</span>
		<span class="sb-item">
			<ChevronsUp size={14} />0↑
			<ChevronsDown size={14} />2↓
		</span>
	</div>

	<div class="sb-right">
		<span class="sb-item">Ln 1, Col 1</span>
		<span class="sb-item">Spaces: 2</span>
		<span class="sb-item">UTF-8</span>
		<span class="sb-item">LF</span>
		<span class="sb-item"><Code2 size={14} /> Svelte</span>
		<span class="sb-item"><BarChart2 size={14} /> Prettier</span>
	</div>
</footer>

<style>
	footer {
		height: 22px;
		background: #0078d4;
		display: flex;
		align-items: center;
		font-size: 12px;
		color: #fff;
		user-select: none;
	}

	.sb-left {
		display: flex;
		align-items: center;
		height: 100%;
	}

	.sb-right {
		display: flex;
		align-items: center;
		height: 100%;
		margin-left: auto;
	}

	.sb-item {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 0 8px;
		height: 100%;
		cursor: pointer;
		white-space: nowrap;

		&:hover {
			background: rgba(255, 255, 255, 0.12);
		}

		&.branch {
			background: rgba(0, 0, 0, 0.15);
		}
	}
</style>
