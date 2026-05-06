<script>
	import { Group, Layout } from '$components/ide/layout';
	import { Sidebar } from '$components/ide/sidebar';
	import { Editor } from '$components/ide/editor';
	import { Terminal } from '$components/ide/terminal';
	import { Preview } from '$components/ide/preview';
</script>

<Layout direction="horizontal">
	<!-- Right side: sidebar pane + group pane -->
	{#snippet leftsidebar()}
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

	{#snippet rightsidebar()}
		<Preview />
	{/snippet}
</Layout>
