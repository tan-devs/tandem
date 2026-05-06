<script lang="ts">
	import { LoaderCircle } from '@lucide/svelte';
</script>

<span class="spinner">
	<LoaderCircle role="status" aria-label="Loading" />
</span>

<style>
	.spinner {
		display: inline-flex;
		justify-content: center;
		align-content: center;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
