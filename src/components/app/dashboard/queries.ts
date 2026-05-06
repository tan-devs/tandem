// Pure query factories — no side effects, fully mockable
import { api } from '$convex/functions/_generated/api.js';
import { useQuery } from '@mmailaender/convex-svelte';
import type { UseQueryOptions } from '@mmailaender/convex-svelte';
import type { CurrentUser } from '$types/user';

export type QueryDeps = {
	isAuthenticated: () => boolean;
	initialUser: CurrentUser | null;
};

type CurrentUserQuery = typeof api.auth.getCurrentUser;

export function createCurrentUserQuery({ isAuthenticated, initialUser }: QueryDeps) {
	const options: UseQueryOptions<CurrentUserQuery> = {
		initialData: initialUser ?? undefined,
		keepPreviousData: true
	};

	return useQuery(
		api.auth.getCurrentUser,
		() => (isAuthenticated() ? {} : 'skip'),
		() => options
	);
}
