<script lang="ts">
	import { resolve } from '$app/paths';

	import ThemeToggle from './theme-toggle.svelte';
	import favicon from '$lib/assets/favicon.svg';
</script>

<nav>
	<span>
		<a href="https://github.com/tan-devs/tandem">
			<img src={favicon} alt="logo" />
		</a>
	</span>
	<menu>
		<li><a href={resolve('/')}>home</a></li>
		<li><a href={resolve('/auth')}>auth</a></li>
		<li><a href={resolve('/repo')}>repo</a></li>
		<li><a href={resolve('/demo')}>demo</a></li>
	</menu>
	<span>
		<ThemeToggle />
	</span>
</nav>

<style>
	nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 1.5rem;
		margin-inline: auto;

		span {
			display: flex;
			align-items: center;
			a {
				background: none;

				border: 1px solid light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.15));

				aspect-ratio: 1;
				padding: 8px;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;

				&:hover {
					background-color: light-dark(rgba(0, 0, 0, 0.05), rgba(255, 255, 255, 0.1));
				}

				@media (hover: hover) {
					&:hover {
						transform: scale(1.05);
					}
				}

				&:active {
					transform: scale(0.95);
				}

				img {
					height: 2rem;
					width: auto;
				}
			}
		}

		menu {
			display: flex;
			gap: 1.5rem;
			list-style: none;
			padding: 0;
			margin: 0;

			li {
				font-size: 0.875rem;
				font-weight: 500;
				cursor: pointer;
				text-transform: capitalize;

				&:hover {
					color: light-dark(#000, #3b82f6);
				}
			}
		}
	}
</style>
