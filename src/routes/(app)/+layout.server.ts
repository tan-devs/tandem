import { api } from '$convex/functions/_generated/api.js';
import { createConvexHttpClient } from '$lib/sveltekit/index.js';
import type { LayoutServerLoad } from './$types.js';

export const load = (async ({ locals }) => {
	const authState = { isAuthenticated: !!locals.token };

	if (!locals.token) {
		return { currentUser: null, authState };
	}

	const client = createConvexHttpClient({ token: locals.token });
	try {
		const currentUser = await client.query(api.auth.getCurrentUser, {});
		return { currentUser, authState };
	} catch {
		return { currentUser: null, authState };
	}
}) satisfies LayoutServerLoad;
