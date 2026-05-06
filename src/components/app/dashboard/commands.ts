// Async commands — pure inputs/outputs, easy to unit test
import { invalidateAll } from '$app/navigation';
import { authClient } from '$lib/services/client/auth.js';

export type CommandResult = { ok: true } | { ok: false; error: unknown };

export async function signOutCommand(): Promise<CommandResult> {
	const { error } = await authClient.signOut();
	if (error) return { ok: false, error };

	await invalidateAll();
	return { ok: true };
}
