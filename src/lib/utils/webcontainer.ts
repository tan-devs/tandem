import type { WebContainer } from '@webcontainer/api';

export type WebContainerBootFn = () => Promise<WebContainer>;

export function createSingletonBooter(boot: WebContainerBootFn) {
	let instance: WebContainer | null = null;
	let booting: Promise<WebContainer> | null = null;

	return async function getOrBoot(): Promise<WebContainer> {
		if (instance) return instance;
		if (booting) return booting;

		booting = boot().then((wc) => {
			instance = wc;
			booting = null;
			return wc;
		});

		return booting;
	};
}

export function toWebContainerError(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}
