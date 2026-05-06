// Sync UI event responders — delegate to commands, never contain logic
import { signOutCommand } from './commands';

export function createHandlers(opts: { onError: (msg: string) => void }) {
	async function handleSignOut() {
		const result = await signOutCommand();
		if (!result.ok) opts.onError('Sign out failed');
	}

	function handleOpen(path: string, content: string) {
		// Delegates upward — no logic lives here
		console.log('open', path, content.slice(0, 80));
	}

	return { handleSignOut, handleOpen };
}
