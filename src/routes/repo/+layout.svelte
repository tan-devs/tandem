<script>
	import { resolve } from '$app/paths';

	let { children } = $props();
</script>

<header><a href={resolve('/')}>home</a></header>

<main>
	{@render children()}
</main>
