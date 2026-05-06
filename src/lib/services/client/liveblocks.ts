import { createClient } from '@liveblocks/client';
import { browser } from '$app/environment';

let cachedClient: ReturnType<typeof createClient> | null = null;

export function getLiveblocksClient() {
	if (!browser) throw new Error('Liveblocks client is only available in the browser');
	if (cachedClient) return cachedClient;

	cachedClient = createClient({
		authEndpoint: async (room) => {
			const response = await fetch('/api/liveblocks-auth', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ room })
			});

			if (!response.ok) throw new Error('Failed to authenticate with Liveblocks');
			return response.json();
		}
	});

	return cachedClient;
}
