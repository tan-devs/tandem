// Sync UI event responders — delegate to services, never contain logic
import type { FinderService } from '$lib/services/domain/finder.svelte';

export function createHandlers({ finderService }: { finderService: FinderService }) {
	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			finderService.clearContextMenu();
			finderService.clearCreating();
		}
	}

	function handleWindowClick() {
		finderService.clearContextMenu();
	}

	return { handleKeyDown, handleWindowClick };
}
