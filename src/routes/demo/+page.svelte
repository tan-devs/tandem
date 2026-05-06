<script>
	import { resolve } from '$app/paths';
	import { Spinner } from '$components/ui/spinner';
	import { Menubar } from '$components/primitives/menubar';
	// Define the status state using the $state rune
	let status = $state('closed');

	// Simple toggle function
	function toggle() {
		status = status === 'closed' ? 'open' : 'closed';
	}
</script>

<Menubar />
<!-- The data-status attribute updates automatically when 'status' changes -->
<button onclick={toggle} data-status={status}>
	{status === 'closed' ? 'Open' : 'Close'} Menu
</button>

<div class="content" data-status={status}>
	<p>Secret content revealed!</p>
</div>
<Spinner />

<a href={resolve('/demo/playwright')}>playwright</a>

<style>
	/* Use CSS attribute selectors for styling */
	button[data-status='open'] {
		background: #ff3e00;
		color: white;
	}

	.content {
		transition: opacity 0.3s;
	}

	.content[data-status='closed'] {
		opacity: 0;
		pointer-events: none;
	}

	.content[data-status='open'] {
		opacity: 1;
	}
</style>
