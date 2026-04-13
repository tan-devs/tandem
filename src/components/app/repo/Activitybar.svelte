<script>
	import { Tabs } from 'bits-ui';
</script>

<Tabs.List>
	{#snippet child({ props })}
		<menu {...props}>
			<li><Tabs.Trigger value="explorer">icon</Tabs.Trigger></li>
			<li><Tabs.Trigger value="source-control">icon</Tabs.Trigger></li>
		</menu>
	{/snippet}
</Tabs.List>

<style>
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
