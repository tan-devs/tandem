import type { WebContainer } from '@webcontainer/api';
import type { FinderNode } from '$types/finder';
import { readDir as readWebContainerDir } from '$lib/utils/filesystem';
import {
	createSingletonBooter,
	toWebContainerError,
	type WebContainerBootFn
} from '$lib/utils/webcontainer';

// ─── State shape ──────────────────────────────────────────────
type WebContainerState =
	| { status: 'idle' }
	| { status: 'booting' }
	| { status: 'ready'; instance: WebContainer; fs: FinderNode[] }
	| { status: 'error'; message: string };

// ─── Pure guards — no side effects, fully unit-testable ───────
export function canBoot(status: WebContainerState['status']): boolean {
	return status === 'idle' || status === 'error';
}

export function isReady(
	state: WebContainerState
): state is Extract<WebContainerState, { status: 'ready' }> {
	return state.status === 'ready';
}

// ─── Deps — caller supplies concrete implementations ──────────
export type WebContainerHookDeps = {
	boot: WebContainerBootFn;
	readDir: typeof readWebContainerDir;
};

// Default deps defined at module level, not inside the hook,
// so the hook itself stays free of direct WebContainer coupling.
export async function defaultBoot(): Promise<WebContainer> {
	const { WebContainer } = await import('@webcontainer/api');
	return WebContainer.boot();
}

export const defaultDeps: WebContainerHookDeps = {
	boot: defaultBoot,
	readDir: readWebContainerDir
};

// ─── Hook ─────────────────────────────────────────────────────
export function useWebContainer(deps: WebContainerHookDeps = defaultDeps) {
	const getOrBoot = createSingletonBooter(deps.boot);
	const readTree = deps.readDir;

	let state = $state<WebContainerState>({ status: 'idle' });

	async function boot() {
		if (!canBoot(state.status)) return;
		state = { status: 'booting' };
		try {
			const instance = await getOrBoot();
			const fs = await readTree(instance, '/');
			state = { status: 'ready', instance, fs };
		} catch (err) {
			state = { status: 'error', message: toWebContainerError(err) };
		}
	}

	async function refresh() {
		if (!isReady(state)) return;
		const fs = await readTree(state.instance, '/');
		state = { ...state, fs };
	}

	async function readFile(path: string): Promise<string> {
		if (!isReady(state)) throw new Error('WebContainer not ready');
		return state.instance.fs.readFile(path, 'utf-8');
	}

	async function writeFile(path: string, content: string) {
		if (!isReady(state)) throw new Error('WebContainer not ready');
		await state.instance.fs.writeFile(path, content);
		await refresh();
	}

	async function mkdir(path: string) {
		if (!isReady(state)) throw new Error('WebContainer not ready');
		await state.instance.fs.mkdir(path, { recursive: true });
		await refresh();
	}

	async function rm(path: string, recursive = false) {
		if (!isReady(state)) throw new Error('WebContainer not ready');
		await state.instance.fs.rm(path, { recursive });
		await refresh();
	}

	return {
		get status() {
			return state.status;
		},
		get instance() {
			return isReady(state) ? state.instance : null;
		},
		get fs() {
			return isReady(state) ? state.fs : [];
		},
		get error() {
			return state.status === 'error' ? state.message : null;
		},
		boot,
		refresh,
		readFile,
		writeFile,
		mkdir,
		rm
	};
}
