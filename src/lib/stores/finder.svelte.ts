import { createWebContainerService, createFinderService } from '$lib/factories/create-services';
import type { FinderService } from '$lib/services/domain/finder.svelte';
import type { WebContainerService } from '$lib/services/domain/webcontainer.svelte';

class FinderStoreContainer {
	wcService: WebContainerService;
	finderService: FinderService | null = null;

	constructor() {
		this.wcService = createWebContainerService();
	}

	initFinder(onopen?: (path: string, content: string) => void) {
		this.finderService = createFinderService(this.wcService, onopen);
	}

	get finder(): FinderService {
		if (!this.finderService) {
			throw new Error('FinderService not initialized. Call initFinder first.');
		}
		return this.finderService;
	}
}

export const finderStore = new FinderStoreContainer();
