import { setContext, getContext } from 'svelte';
import type { WebContainerService } from '$lib/services/domain/webcontainer.svelte';
import type { FinderService } from '$lib/services/domain/finder.svelte';

const WC_KEY = Symbol('WebContainerService');
const FINDER_KEY = Symbol('FinderService');

export function setWebContainerContext(wcService: WebContainerService) {
	setContext(WC_KEY, wcService);
}

export function getWebContainerContext(): WebContainerService {
	return getContext(WC_KEY);
}

export function setFinderContext(finderService: FinderService) {
	setContext(FINDER_KEY, finderService);
}

export function getFinderContext(): FinderService {
	return getContext(FINDER_KEY);
}
