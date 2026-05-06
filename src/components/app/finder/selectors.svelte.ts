// Pure selectors — no side effects, fully unit-testable
import type { WebContainerService } from '$lib/services/domain/webcontainer.svelte';
import type { FinderService } from '$lib/services/domain/finder.svelte';
import type { FinderNode } from '$types/finder';

const EXT_ICONS: Record<string, string> = {
	ts: '󰛦',
	js: '󰌞',
	svelte: '󰯸',
	vue: '󰡄',
	jsx: '󰜈',
	tsx: '󰜈',
	json: '󰘦',
	md: '󰍔',
	css: '󰌜',
	html: '󰌝',
	py: '󰌠',
	rs: '󱘗',
	go: '󰟓',
	sh: '󰆍',
	env: '󰒓',
	toml: '󰅪',
	yaml: '󰳙',
	yml: '󰳙',
	png: '󰋩',
	jpg: '󰋩',
	jpeg: '󰋩',
	svg: '󰜡',
	gif: '󰋩',
	webp: '󰋩',
	lock: '󰌾',
	gitignore: '󰊢'
};

const EXT_COLORS: Record<string, string> = {
	ts: 'var(--c-ts)',
	tsx: 'var(--c-ts)',
	js: 'var(--c-js)',
	jsx: 'var(--c-js)',
	svelte: 'var(--c-svelte)',
	vue: 'var(--c-vue)',
	json: 'var(--c-json)',
	md: 'var(--c-md)',
	css: 'var(--c-css)',
	html: 'var(--c-html)',
	py: 'var(--c-py)',
	rs: 'var(--c-rs)',
	png: 'var(--c-img)',
	jpg: 'var(--c-img)',
	jpeg: 'var(--c-img)',
	svg: 'var(--c-img)',
	gif: 'var(--c-img)'
};

export function selectNodeIcon(node: FinderNode): string {
	if (node.kind === 'dir') return '󰉋';
	const ext = node.name.split('.').pop()?.toLowerCase() ?? '';
	return EXT_ICONS[ext] ?? '󰈔';
}

export function selectNodeColor(node: FinderNode): string {
	if (node.kind === 'dir') return 'var(--c-dir)';
	const ext = node.name.split('.').pop()?.toLowerCase() ?? '';
	return EXT_COLORS[ext] ?? 'var(--c-file)';
}

export type WcView = 'idle' | 'booting' | 'error' | 'ready';

export function selectWcView(status: WebContainerService['status']): WcView {
	switch (status) {
		case 'idle':
			return 'idle';
		case 'booting':
			return 'booting';
		case 'error':
			return 'error';
		default:
			return 'ready';
	}
}

export function selectContextMenu(finderService: FinderService) {
	return finderService.state.contextMenu ?? null;
}
