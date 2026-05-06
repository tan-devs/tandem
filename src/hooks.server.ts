import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { getToken } from '$lib/sveltekit/index.js';
import { withServerConvexToken } from '@mmailaender/convex-svelte/sveltekit/server';

const auth: Handle = async ({ event, resolve }) => {
	const token = await getToken(event.cookies);
	event.locals.token = token;
	return withServerConvexToken(token, () => resolve(event));
};

const isolation: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	// WebContainer routes — need SharedArrayBuffer
	const needsIsolation =
		pathname === '/' ||
		pathname.startsWith('/[repo]') || // SvelteKit param route
		/^\/[^/]+/.test(pathname); // any /[slug] at root depth

	const response = await resolve(event);

	if (needsIsolation && !pathname.startsWith('/api/auth')) {
		response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
		response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
	}

	return response;
};

export const handle = sequence(auth, isolation);
