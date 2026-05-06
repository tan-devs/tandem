import type { FinderNode } from '$types/finder';
import type { WebContainer } from '@webcontainer/api';

export type ReadDirOptions = {
	ignoreDirNames?: Set<string>;
	maxDepth?: number;
	maxTotalNodes?: number;
	maxEntriesPerDirectory?: number;
};

type ReadDirInternalState = {
	nodeCount: number;
};

const DEFAULT_IGNORED_DIR_NAMES = new Set([
	'node_modules',
	'.git',
	'.next',
	'.svelte-kit',
	'dist',
	'build',
	'.turbo',
	'.pnpm-store',
	'.yarn',
	'.cache',
	'coverage'
]);

const DEFAULT_READ_DIR_OPTIONS: Required<ReadDirOptions> = {
	ignoreDirNames: DEFAULT_IGNORED_DIR_NAMES,
	maxDepth: 12,
	maxTotalNodes: 5000,
	maxEntriesPerDirectory: 500
};

function normalizeReadDirOptions(options?: ReadDirOptions): Required<ReadDirOptions> {
	return {
		ignoreDirNames: options?.ignoreDirNames ?? DEFAULT_READ_DIR_OPTIONS.ignoreDirNames,
		maxDepth: options?.maxDepth ?? DEFAULT_READ_DIR_OPTIONS.maxDepth,
		maxTotalNodes: options?.maxTotalNodes ?? DEFAULT_READ_DIR_OPTIONS.maxTotalNodes,
		maxEntriesPerDirectory:
			options?.maxEntriesPerDirectory ?? DEFAULT_READ_DIR_OPTIONS.maxEntriesPerDirectory
	};
}

function sorted(nodes: FinderNode[]): FinderNode[] {
	return nodes.sort((a, b) => {
		if (a.kind !== b.kind) return a.kind === 'dir' ? -1 : 1;
		return a.name.localeCompare(b.name);
	});
}

export async function readDir(
	wc: WebContainer,
	dirPath: string,
	options?: ReadDirOptions,
	depth = 0,
	state?: ReadDirInternalState
): Promise<FinderNode[]> {
	const config = normalizeReadDirOptions(options);
	const scanState = state ?? { nodeCount: 0 };

	if (depth > config.maxDepth || scanState.nodeCount >= config.maxTotalNodes) {
		return [];
	}

	const entries = await wc.fs.readdir(dirPath, { withFileTypes: true });
	const nodes: FinderNode[] = [];
	let acceptedEntries = 0;

	for (const entry of entries) {
		if (acceptedEntries >= config.maxEntriesPerDirectory) break;
		if (scanState.nodeCount >= config.maxTotalNodes) break;

		const fullPath = dirPath === '/' ? `/${entry.name}` : `${dirPath}/${entry.name}`;
		if (entry.isDirectory()) {
			if (config.ignoreDirNames.has(entry.name)) continue;

			if ('isSymbolicLink' in entry && typeof entry.isSymbolicLink === 'function') {
				if (entry.isSymbolicLink()) continue;
			}

			scanState.nodeCount += 1;
			acceptedEntries += 1;
			const children = await readDir(wc, fullPath, config, depth + 1, scanState);
			nodes.push({ kind: 'dir', name: entry.name, path: fullPath, children });
		} else {
			scanState.nodeCount += 1;
			acceptedEntries += 1;
			nodes.push({ kind: 'file', name: entry.name, path: fullPath });
		}
	}

	return sorted(nodes);
}
