<script lang="ts">
	import { Tabs } from 'bits-ui';
	import Button from '$components/ui/button.svelte';
	import { Files, Search, GitBranch, Play, Puzzle, Settings, User } from '@lucide/svelte';
	import { panels } from '$lib/stores/panel.svelte';

	let { currentTab = $bindable() }: { currentTab: string } = $props();

	const items = [
		{ value: 'explorer', icon: Files },
		{ value: 'search', icon: Search },
		{ value: 'source-control', icon: GitBranch },
		{ value: 'run', icon: Play },
		{ value: 'extensions', icon: Puzzle }
	];

	function handleClick(value: string) {
		if (value === currentTab && !panels.isCollapsed('sidebar')) {
			panels.toggle('sidebar');
		} else {
			panels.expand('sidebar');
			currentTab = value;
		}
	}
</script>

<Tabs.List>
	{#snippet child({ props })}
		<aside {...props}>
			<menu>
				{#each items as { value, icon: Icon } (value)}
					<li>
						<Tabs.Trigger {value} onclick={() => handleClick(value)}>
							{#snippet child({ props: trigger })}
								<Button variant="ghost" {...trigger}><Icon size={20} /></Button>{/snippet}
						</Tabs.Trigger>
					</li>
				{/each}
			</menu>
			<menu>
				<li><Button variant="ghost"><User /></Button></li>
				<li><Button variant="ghost"><Settings /></Button></li>
			</menu>
		</aside>
	{/snippet}
</Tabs.List>

<!-- styles unchanged -->

<style>
	aside {
		background: #2c2c2d;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	menu {
		width: 48px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	li {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0.6;

		&:hover {
			opacity: 1;
		}
	}
</style>
