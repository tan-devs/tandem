import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createAuth } from '$convex/functions/auth.js';
import { getToken } from '$lib/sveltekit/index.js';
import { withServerConvexToken } from '@mmailaender/convex-svelte/sveltekit/server';

const coepHeaders: Handle = async ({ event, resolve }) => {
	return resolve(event);
};

const auth: Handle = async ({ event, resolve }) => {
	const token = await getToken(createAuth, event.cookies);
	event.locals.token = token;
	return withServerConvexToken(token, () => resolve(event));
};

export const handle = sequence(coepHeaders, auth);
