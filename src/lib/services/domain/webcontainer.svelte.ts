import { WebContainer } from '@webcontainer/api';
import type { FinderNode } from '$types/finder';
import { readDir as readWebContainerDir } from '$lib/utils/filesystem';
import {
	createSingletonBooter,
	toWebContainerError,
	type WebContainerBootFn
} from '$lib/utils/webcontainer';

type WebContainerState =
	| { status: 'idle' }
	| { status: 'booting' }
	| { status: 'ready'; instance: WebContainer; fs: FinderNode[] }
	| { status: 'error'; message: string };

export class WebContainerService {
	private getOrBoot: () => Promise<WebContainer>;
	private readTree: typeof readWebContainerDir;
	private state = $state<WebContainerState>({ status: 'idle' });

	constructor(
		boot: WebContainerBootFn = () => WebContainer.boot(),
		readDir: typeof readWebContainerDir = readWebContainerDir
	) {
		this.getOrBoot = createSingletonBooter(boot);
		this.readTree = readDir;
	}

	async boot() {
		if (this.state.status === 'ready' || this.state.status === 'booting') return;
		this.state = { status: 'booting' };
		try {
			const wc = await this.getOrBoot();
			const fs = await this.readTree(wc, '/');
			this.state = { status: 'ready', instance: wc, fs };
		} catch (err) {
			this.state = { status: 'error', message: toWebContainerError(err) };
		}
	}

	async refresh() {
		if (this.state.status !== 'ready') return;
		const wc = this.state.instance;
		const fs = await this.readTree(wc, '/');
		this.state = { ...this.state, fs };
	}

	async readFile(path: string): Promise<string> {
		if (this.state.status !== 'ready') throw new Error('WebContainer not ready');
		return this.state.instance.fs.readFile(path, 'utf-8');
	}

	async writeFile(path: string, content: string) {
		if (this.state.status !== 'ready') throw new Error('WebContainer not ready');
		await this.state.instance.fs.writeFile(path, content);
		await this.refresh();
	}

	async mkdir(path: string) {
		if (this.state.status !== 'ready') throw new Error('WebContainer not ready');
		await this.state.instance.fs.mkdir(path, { recursive: true });
		await this.refresh();
	}

	async rm(path: string, recursive = false) {
		if (this.state.status !== 'ready') throw new Error('WebContainer not ready');
		await this.state.instance.fs.rm(path, { recursive });
		await this.refresh();
	}

	get status() {
		return this.state.status;
	}

	get instance() {
		return this.state.status === 'ready' ? this.state.instance : null;
	}

	get fs() {
		return this.state.status === 'ready' ? this.state.fs : [];
	}

	get error() {
		return this.state.status === 'error' ? this.state.message : null;
	}
}
