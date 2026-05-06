import type { FinderNode, SidebarItem } from '$types/finder';
import type { WebContainerService } from './webcontainer.svelte';

export class FinderService {
	private history = $state<string[]>(['/']);
	private historyIdx = $state(0);
	private selected = $state<string>('/');
	private preview = $state<{ path: string; content: string; loading: boolean } | null>(null);
	private contextMenu = $state<{ x: number; y: number; node: FinderNode } | null>(null);
	private creating = $state<{ kind: 'file' | 'dir'; name: string } | null>(null);
	private sidebarSelected = $state<string>('root');

	private currentChildren = $derived.by(() => {
		if (!this.wcService || !this.wcService.fs) return [];
		function findChildren(nodes: FinderNode[], path: string): FinderNode[] {
			if (path === '/') return nodes;
			for (const n of nodes) {
				if (n.path === path && n.kind === 'dir') return n.children;
				if (n.kind === 'dir') {
					const found = findChildren(n.children, path);
					if (found.length > 0) return found;
				}
			}
			return [];
		}
		return findChildren(this.wcService.fs as unknown as FinderNode[], this.selected);
	});

	constructor(
		private wcService: WebContainerService,
		private onopen?: (path: string, content: string) => void
	) {}

	back = () => {
		if (this.historyIdx > 0) {
			this.historyIdx--;
			this.selected = this.history[this.historyIdx];
			this.preview = null;
		}
	};

	forward = () => {
		if (this.historyIdx < this.history.length - 1) {
			this.historyIdx++;
			this.selected = this.history[this.historyIdx];
			this.preview = null;
		}
	};

	goToPath = (path: string) => {
		this.history = this.history.slice(0, this.historyIdx + 1);
		this.history.push(path);
		this.historyIdx = this.history.length - 1;
		this.selected = path;
		this.preview = null;
	};

	sidebarClick = (item: SidebarItem) => {
		if (item.path) {
			this.goToPath(item.path);
			this.sidebarSelected = item.id;
		}
	};

	selectNode = async (node: FinderNode) => {
		if (node.kind === 'dir') {
			this.goToPath(node.path);
			this.sidebarSelected = '';
		} else {
			this.selected = node.path;
			this.preview = { path: node.path, content: '', loading: true };
			try {
				const content = await this.wcService.readFile(node.path);
				this.preview = { path: node.path, content, loading: false };
			} catch {
				this.preview = { path: node.path, content: '(binary or unreadable)', loading: false };
			}
		}
	};

	openFile = (node: FinderNode) => {
		if (node.kind === 'dir' || !this.preview || this.preview.loading) return;
		this.onopen?.(node.path, this.preview.content);
	};

	onContextMenu = (e: MouseEvent, node: FinderNode) => {
		e.preventDefault();
		this.contextMenu = { x: e.clientX, y: e.clientY, node };
	};

	ctxDelete = async (node: FinderNode) => {
		this.contextMenu = null;
		await this.wcService.rm(node.path, node.kind === 'dir');
	};

	startCreate = (kind: 'file' | 'dir') => {
		this.creating = { kind, name: '' };
	};

	setCreateName = (name: string) => {
		if (!this.creating) return;
		this.creating = { ...this.creating, name };
	};

	commitCreate = async () => {
		if (!this.creating || !this.creating.name.trim()) {
			this.creating = null;
			return;
		}
		const parentPath = this.selected === '/' ? '/' : this.selected;
		const fullPath =
			parentPath === '/' ? `/${this.creating.name}` : `${parentPath}/${this.creating.name}`;
		if (this.creating.kind === 'dir') await this.wcService.mkdir(fullPath);
		else await this.wcService.writeFile(fullPath, '');
		this.creating = null;
	};

	clearContextMenu = () => {
		this.contextMenu = null;
	};

	clearCreating = () => {
		this.creating = null;
	};

	get wc() {
		return this.wcService;
	}

	get state() {
		return {
			history: this.history,
			historyIdx: this.historyIdx,
			selected: this.selected,
			preview: this.preview,
			contextMenu: this.contextMenu,
			creating: this.creating,
			sidebarSelected: this.sidebarSelected,
			currentChildren: this.currentChildren
		};
	}
}
