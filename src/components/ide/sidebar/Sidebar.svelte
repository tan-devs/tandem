<script lang="ts">
	import { Accordion } from 'bits-ui';

	import { Tabs } from 'bits-ui';

	import { slide } from 'svelte/transition';
	import { ChevronDown } from '@lucide/svelte';

	const sections = [
		{ value: 'files', label: 'files', items: ['index.ts', 'App.svelte', 'main.ts'] },
		{ value: 'git', label: 'source control', items: ['2 changes'] },
		{ value: 'outline', label: 'outline', items: ['createPanelStore', 'PaneEntry'] }
	];
</script>

<!-- Tabs.Content lives here, still inside the same Tabs.Root -->
<Tabs.Content value="explorer">
	{#snippet child({ props })}
		<aside {...props} class="sidebar">
			<Accordion.Root type="multiple" value={['files']}>
				{#each sections as section (section)}
					<Accordion.Item value={section.value}>
						<Accordion.Header>
							<Accordion.Trigger class="trigger">
								<span>{section.label}</span>
								<ChevronDown size={12} class="chevron" />
							</Accordion.Trigger>
						</Accordion.Header>
						<Accordion.Content forceMount>
							{#snippet child({ props, open })}
								{#if open}
									<ul {...props} transition:slide={{ duration: 150 }}>
										{#each section.items as item (item)}
											<li>{item}</li>
										{/each}
									</ul>
								{/if}
							{/snippet}
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</aside>
	{/snippet}
</Tabs.Content>

<Tabs.Content value="source-control">
	<aside class="sidebar">source control</aside>
</Tabs.Content>

<style>
	.sidebar {
		height: 100%;
		overflow-y: auto;
		font-size: 13px;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 0 0 8px;
	}

	:global(.trigger) {
		all: unset;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 4px 8px;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		opacity: 0.5;
		cursor: pointer;
		box-sizing: border-box;

		&:hover {
			opacity: 1;
		}
	}

	:global(.trigger[data-state='open'] .chevron) {
		transform: rotate(180deg);
	}

	:global(.chevron) {
		width: 12px;
		height: 12px;
		transition: transform 150ms ease;
		flex-shrink: 0;
	}
</style>
