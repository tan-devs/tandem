import type { Pane } from 'paneforge';

type PaneEntry = {
	api: Pane | null;
	size: number;
	collapsed: boolean;
};

function createPanelStore() {
	const panes = $state<Record<string, PaneEntry>>({});

	return {
		get panes() {
			return panes;
		},

		register(id: string, api: Pane, defaultSize: number) {
			panes[id] = { api, size: defaultSize, collapsed: false };
		},

		unregister(id: string) {
			delete panes[id];
		},

		onResize(id: string, size: number) {
			if (panes[id]) {
				panes[id].size = size;
				panes[id].collapsed = size === 0;
			}
		},

		collapse(id: string) {
			panes[id]?.api?.collapse();
		},

		expand(id: string) {
			panes[id]?.api?.expand();
		},

		resize(id: string, size: number) {
			panes[id]?.api?.resize(size);
		},

		toggle(id: string) {
			if (panes[id]?.collapsed) {
				panes[id].api?.expand();
			} else {
				panes[id].api?.collapse();
			}
		},

		isCollapsed: (id: string) => panes[id]?.collapsed ?? false,
		getSize: (id: string) => panes[id]?.size ?? 0
	};
}

export const panels = createPanelStore();
