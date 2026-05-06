import { WebContainerService } from '$lib/services/domain/webcontainer.svelte';
import { FinderService } from '$lib/services/domain/finder.svelte';
import type { WebContainerBootFn } from '$lib/utils/webcontainer';
import type { readDir as readWebContainerDir } from '$lib/utils/filesystem';

export function createWebContainerService(options?: {
	boot?: WebContainerBootFn;
	readDir?: typeof readWebContainerDir;
}): WebContainerService {
	return new WebContainerService(options?.boot, options?.readDir);
}

export function createFinderService(
	wcService: WebContainerService,
	onopen?: (path: string, content: string) => void
): FinderService {
	return new FinderService(wcService, onopen);
}
