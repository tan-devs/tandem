<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<section>
	<main>
		<h1>Welcome to Tandem</h1>
		<p>Visit <a href="https://github.com">github</a> to read the documentation</p>
		<div class="actions">
			<a href={resolve('/auth')}>sign-up or login</a>
			<a href={resolve('/repo')}>go to workspace</a>
		</div>
	</main>
</section>

<style>
	section {
		width: 100%;
		height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;

		main {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5rem;
			text-align: center;

			.actions {
				display: flex;
				gap: 1.5rem;
			}
		}
	}
</style>
