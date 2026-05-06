<script>
	import {
		PanelBottom,
		PanelRight,
		LayoutPanelLeft,
		PanelLeft,
		ArrowLeft,
		ArrowRight,
		ChevronDown,
		Bubbles
	} from '@lucide/svelte';
	import { panels } from '$lib/stores/panel.svelte';
	import { Menubar } from '$components/primitives/menubar';
</script>

<header>
	<div class="context">
		<Menubar />
	</div>

	<div class="command">
		<ArrowLeft size={14} />
		<ArrowRight size={14} />
		<div class="wrap">
			<input placeholder="Workspace" />
			<div class="actions">
				<button class="btn"><Bubbles size={12} /></button>
				<button class="btn chevron"><ChevronDown size={12} /></button>
			</div>
		</div>
	</div>

	<div class="controls">
		<button
			class="lc"
			class:active={!panels.isCollapsed('sidebar') ||
				!panels.isCollapsed('panel') ||
				!panels.isCollapsed('secondary-sidebar')}
			title="Toggle Layout"
		>
			<LayoutPanelLeft size={14} />
		</button>
		<button
			class="lc"
			class:active={!panels.isCollapsed('sidebar')}
			onclick={() => panels.toggle('sidebar')}
			title="Toggle Primary Sidebar"
		>
			<PanelLeft size={14} />
		</button>
		<button
			class="lc"
			class:active={!panels.isCollapsed('panel')}
			onclick={() => panels.toggle('panel')}
			title="Toggle Panel"
		>
			<PanelBottom size={14} />
		</button>
		<button
			class="lc"
			class:active={!panels.isCollapsed('secondary-sidebar')}
			onclick={() => panels.toggle('secondary-sidebar')}
			title="Toggle Secondary Sidebar"
		>
			<PanelRight size={14} />
		</button>
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;

		height: 2rem;
		background: #323233;
		display: flex;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		align-items: center;
		user-select: none;
		-webkit-app-region: drag;
		overflow: hidden;

		.context {
			display: grid;
			grid-template-columns: auto auto;
		}

		.command {
			display: flex;
			align-items: center; /* was align-content */
			gap: 4px;

			.wrap {
				position: relative;
				display: flex;
				align-items: center;
				flex: 1;
			}

			input {
				width: 100%;
				background: #3c3c3c;
				border: 1px solid #555;
				border-radius: 0.25rem;
				padding: 0 4px;
				padding-right: 52px; /* make room for the button group */
				color: #ccc;
				font-size: 13px;
				height: 22px;
				outline: none;

				&:focus {
					border-color: #0078d4;
				}
			}

			.actions {
				position: absolute;
				right: 1px; /* sit just inside the border */
				top: 1px;
				bottom: 1px;
				display: flex;
				align-items: stretch;
				border-left: 1px solid #555;
				border-radius: 0 3px 3px 0;
				overflow: hidden;
			}

			.btn {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 24px;
				background: #3c3c3c;
				border: none;
				color: #ccc;
				cursor: pointer;
				-webkit-app-region: no-drag;

				&:hover {
					background: #505050;
					color: #fff;
				}

				/* divider between buttons */
				& + .btn {
					border-left: 1px solid #555;
					height: auto;
				}
			}
		}

		.controls {
			display: flex;
			align-items: center;
			height: 100%;
			flex-shrink: 0;
			-webkit-app-region: no-drag;
		}
	}

	.lc {
		width: 26px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		color: #cccccc;
		cursor: pointer;
		border-radius: 3px;
		opacity: 0.7;
		flex-shrink: 0;

		&:hover {
			background: #505050;
			opacity: 1;
		}

		&.active {
			opacity: 1;
		}
	}
</style>
