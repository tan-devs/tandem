export type FinderNode =
	| { kind: 'file'; name: string; path: string }
	| { kind: 'dir'; name: string; path: string; children: FinderNode[] };

export type SidebarItem = { id: string; label: string; icon: string; path: string | null };

export type Preview = { path: string; content: string; loading: boolean };
