// Derived reactive state — needs .svelte.ts for rune support
import type { CurrentUser } from '$types/user';

export function selectUser(
	liveData: CurrentUser | null | undefined, // null = unauthed, undefined = loading
	serverData: CurrentUser | null
): CurrentUser | null {
	return liveData ?? serverData;
}

export function selectIsReady(user: CurrentUser | null): boolean {
	return user !== null;
}
