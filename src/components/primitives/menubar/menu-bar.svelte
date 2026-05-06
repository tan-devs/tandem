<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { Menubar } from 'bits-ui';
	import { Check, Play } from '@lucide/svelte';
	import { resolve } from '$app/paths';

	let selectedView = $state('table');
	let selectedProfile = $state('pavel');

	let grids = $state([
		{
			checked: true,
			label: 'Pixel'
		},
		{
			checked: false,
			label: 'Layout'
		}
	]);

	let showConfigs = $state([
		{
			checked: true,
			label: 'Show Bookmarks'
		},
		{
			checked: false,
			label: 'Show Full URLs'
		}
	]);

	const profiles = [
		{
			value: 'hunter',
			label: 'Hunter'
		},
		{
			value: 'pavel',
			label: 'Pavel'
		},
		{
			value: 'adrian',
			label: 'Adrian'
		}
	];

	const views = [
		{
			value: 'table',
			label: 'Table'
		},
		{
			value: 'board',
			label: 'Board'
		},
		{
			value: 'gallery',
			label: 'Gallery'
		}
	];
</script>

<Menubar.Root>
	<a href={resolve('/')}><img class="logo" src={favicon} alt="logo" /></a>
	<Menubar.Menu>
		<Menubar.Trigger>File</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content align="start" sideOffset={1}>
				{#each grids as grid (grid.label)}
					<Menubar.CheckboxItem bind:checked={grid.checked}>
						{#snippet children({ checked })}
							{grid.label} grid
							<div class="item-right">
								{#if checked}
									{@render SwitchOn()}
								{:else}
									{@render SwitchOff()}
								{/if}
							</div>
						{/snippet}
					</Menubar.CheckboxItem>
				{/each}
				<Menubar.Separator />
				<Menubar.RadioGroup bind:value={selectedView}>
					{#each views as view, i (view.label + i)}
						<Menubar.RadioItem value={view.value}>
							{#snippet children({ checked })}
								{view.label}
								<div class="item-right">
									{#if checked}
										<Check size={12} />
									{/if}
								</div>
							{/snippet}
						</Menubar.RadioItem>
					{/each}
				</Menubar.RadioGroup>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>

	<Menubar.Menu>
		<Menubar.Trigger>Edit</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content align="start" sideOffset={1}>
				<Menubar.Item>Undo</Menubar.Item>
				<Menubar.Item>Redo</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Sub>
					<Menubar.SubTrigger>
						Find
						<div class="item-right">
							<Play size={10} />
						</div>
					</Menubar.SubTrigger>
					<Menubar.SubContent>
						<Menubar.Item>Search the web</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Item>Find...</Menubar.Item>
						<Menubar.Item>Find Next</Menubar.Item>
						<Menubar.Item>Find Previous</Menubar.Item>
					</Menubar.SubContent>
				</Menubar.Sub>
				<Menubar.Separator />
				<Menubar.Item>Cut</Menubar.Item>
				<Menubar.Item>Copy</Menubar.Item>
				<Menubar.Item>Paste</Menubar.Item>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>

	<Menubar.Menu>
		<Menubar.Trigger>View</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content align="start" sideOffset={1}>
				{#each showConfigs as config, i (config.label + i)}
					<Menubar.CheckboxItem bind:checked={config.checked}>
						{#snippet children({ checked })}
							{config.label}
							<div class="item-right">
								{#if checked}
									{@render SwitchOn()}
								{:else}
									{@render SwitchOff()}
								{/if}
							</div>
						{/snippet}
					</Menubar.CheckboxItem>
				{/each}
				<Menubar.Separator />
				<Menubar.Item>Reload</Menubar.Item>
				<Menubar.Item>Force Reload</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item>Toggle Fullscreen</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item>Hide Sidebar</Menubar.Item>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>

	<Menubar.Menu>
		<Menubar.Trigger>Profiles</Menubar.Trigger>
		<Menubar.Portal>
			<Menubar.Content align="start" sideOffset={1}>
				<Menubar.RadioGroup bind:value={selectedProfile}>
					{#each profiles as profile, i (profile.label + i)}
						<Menubar.RadioItem value={profile.value}>
							{#snippet children({ checked })}
								{profile.label}
								<div class="item-right">
									{#if checked}
										<Check size={12} />
									{/if}
								</div>
							{/snippet}
						</Menubar.RadioItem>
					{/each}
				</Menubar.RadioGroup>
				<Menubar.Separator />
				<Menubar.Item>Edit...</Menubar.Item>
				<Menubar.Separator />
				<Menubar.Item>Add Profile...</Menubar.Item>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
</Menubar.Root>

{#snippet SwitchOn()}
	<div class="switch switch-on">
		<span class="switch-thumb"></span>
	</div>
{/snippet}

{#snippet SwitchOff()}
	<div class="switch switch-off">
		<span class="switch-thumb"></span>
	</div>
{/snippet}

<style>
	.logo {
		height: 1rem;
		width: 1rem;
		margin: 0 0.5rem 0 0.5rem;
		opacity: 0.85;
		flex-shrink: 0;
	}

	.item-right {
		margin-left: auto;
		padding-left: 16px;
		display: flex;
		align-items: center;
		color: #cccccc;
	}

	/* Toggle switch */
	.switch {
		width: 24px;
		height: 12px;
		border-radius: 6px;
		position: relative;
		transition: background 0.15s;
		flex-shrink: 0;
	}
	.switch-on {
		background: #0078d4;
	}
	.switch-off {
		background: #555558;
	}
	.switch-thumb {
		position: absolute;
		top: 2px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #fff;
		transition: left 0.15s;
	}
	.switch-on .switch-thumb {
		left: 14px;
	}
	.switch-off .switch-thumb {
		left: 2px;
	}

	:global {
		/* ── Root bar ── */
		[data-menubar-root] {
			display: flex;
			align-items: center;
			height: 100%;
			gap: 0;
			background: transparent;
			color: #cccccc;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', sans-serif;
			font-size: 13px;
			padding: 0;
			border: none;
			border-radius: 0;
		}

		/* ── Trigger buttons (File, Edit, View, Profiles) ── */
		[data-menubar-trigger] {
			height: 100%;
			padding: 0 8px;
			font-size: 13px;
			font-weight: 400;
			color: #cccccc;
			cursor: default;
			border-radius: 0;
			outline: none;
			background: transparent;
			border: none;
			display: flex;
			align-items: center;
			-webkit-app-region: no-drag;
		}

		[data-menubar-trigger]:hover,
		[data-menubar-trigger][data-highlighted],
		[data-menubar-trigger][data-state='open'] {
			background: #505050;
			color: #ffffff;
		}

		/* ── Dropdown content card ── */
		[data-menubar-content],
		[data-menubar-sub-content] {
			background: #252526;
			border: 1px solid #454545;
			border-radius: 0;
			padding: 4px 0;
			min-width: 200px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
			color: #cccccc;
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe WPC', 'Segoe UI', sans-serif;
			font-size: 13px;
			animation: fadeIn 0.08s ease-out;
		}

		/* ── Individual items ── */
		[data-menubar-item],
		[data-menubar-checkbox-item],
		[data-menubar-radio-item],
		[data-menubar-sub-trigger] {
			display: flex;
			align-items: center;
			padding: 4px 12px;
			font-size: 13px;
			line-height: 22px;
			cursor: default;
			outline: none;
			border-radius: 0;
			color: #cccccc;
			gap: 0;
			position: relative;
		}

		[data-menubar-item][data-highlighted],
		[data-menubar-checkbox-item][data-highlighted],
		[data-menubar-radio-item][data-highlighted],
		[data-menubar-sub-trigger][data-highlighted] {
			background: #04395e;
			color: #ffffff;
		}

		[data-menubar-item][data-disabled],
		[data-menubar-checkbox-item][data-disabled],
		[data-menubar-radio-item][data-disabled] {
			opacity: 0.4;
			pointer-events: none;
		}

		/* ── Separator ── */
		[data-menubar-separator] {
			height: 1px;
			background: #3c3c3c;
			margin: 4px 0;
		}

		/* ── Sub-trigger arrow ── */
		[data-menubar-sub-trigger] svg {
			width: 10px;
			height: 10px;
			opacity: 0.7;
		}
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-2px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
