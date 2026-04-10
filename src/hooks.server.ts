import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createAuth } from '$convex/functions/auth.js';
import { getToken } from '$lib/sveltekit/index.js';
import { withServerConvexToken } from '@mmailaender/convex-svelte/sveltekit/server';

const coepHeaders: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	try {
		response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
		response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
		return response;
	} catch {
		// Response headers are immutable (e.g. Better Auth routes) — clone first
		const cloned = new Response(response.body, response);
		cloned.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
		cloned.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
		return cloned;
	}
};

const auth: Handle = async ({ event, resolve }) => {
	const token = await getToken(createAuth, event.cookies);
	event.locals.token = token;
	return withServerConvexToken(token, () => resolve(event));
};

export const handle = sequence(coepHeaders, auth);
