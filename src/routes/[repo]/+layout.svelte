<script lang="ts">
	import { Titlebar, Workspace, Statusbar } from '$components/ide/layout';
	import { Activitybar } from '$components/ide/activitybar';

	let { children } = $props();
	let currentTab = $state('explorer');
</script>

<section>
	<Titlebar />

	<Workspace orientation="vertical" bind:value={currentTab}>
		<Activitybar bind:currentTab />
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
