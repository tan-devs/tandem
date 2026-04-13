<script>
	import { Editor } from '$components/app/editor';
	import { Terminal } from '$components/app/terminal';
	import { Group, Sidebar, Layout } from '$src/components/app/repo';
</script>

<Layout direction="horizontal">
	<!-- Right side: sidebar pane + group pane -->
	{#snippet sidebar()}
		<Sidebar />
	{/snippet}

	<Group>
		{#snippet editor()}
			<Editor />
		{/snippet}

		{#snippet terminal()}
			<Terminal />
		{/snippet}
	</Group>
</Layout>
