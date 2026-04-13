<script>
	import { Header, Activitybar, Workspace, Statusbar } from '$src/components/app/repo';

	let { children } = $props();
</script>

<section>
	<Header />

	<Workspace orientation="vertical" value="explorer">
		<!-- Activity bar: is Tabs.List, sibling to Tabs.Content -->
		<Activitybar />

		{@render children()}
	</Workspace>

	<Statusbar />
</section>

<style>
	section {
		width: 100%;
		height: 100svh;
		display: grid;
		grid-template-rows: auto 1fr auto;
	}
</style>
