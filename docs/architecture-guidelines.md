# Architecture Guidelines (summary of review suggestions)

This document captures recommended conventions, refactors, and patterns discussed in a recent architecture review. Use it as a playbook when making changes, renaming files, or refactoring components and services.

## Naming conventions

- File & folder style: kebab-case, all lowercase. Example: `use-webcontainer.svelte.ts`.
- Hooks: prefix with `use-` (e.g., `use-webcontainer.svelte.ts`).
- Factories: prefix with `create-` (e.g., `create-services.ts`).
- Context helpers: prefix with `context-` (e.g., `context-services.ts`).
- Domain services and clients: no prefix; the folder provides context (e.g., `services/domain/webcontainer.svelte.ts`, `services/client/auth.ts`).

Rules:

- Do not use camelCase or PascalCase for filenames.
- Keep suffixes (`.svelte.ts`, `.svelte`, `.ts`) unchanged.

## Layering and DI responsibilities

- Use the following layering:
  - `hooks/` — lightweight reactive wrappers around external APIs (no domain logic).
  - `services/domain/` — domain service classes that own state and behavior.
  - `factories/` — pure factory functions that instantiate services with injected dependencies.
  - `context/` — thin set/get wrappers that place service instances into Svelte context.
  - `components/` — UI, consuming services via context or props.

- DI boundary pattern: top-level components (e.g., `Dashboard`, `Finder`) should create services and pass them down as props. Child components consume them via context only after the parent has set context.

## Hooks: purity and injection

- Keep hooks pure and dependency-injectable. Example pattern (already applied in `use-webcontainer`):
  - Export pure guard functions (`canBoot`, `isReady`) for unit testing.
  - Accept a `deps` object (`boot`, `readDir`) rather than importing runtime implementations inside the hook.
  - Provide `defaultDeps` at module scope (dynamic imports allowed) so tests can inject fakes.

- Avoid side effects at module evaluation time inside components. For example, call `wc.boot()` inside a Svelte `$effect` rather than at top-level script execution:

```ts
const wc = useWebContainer();
$effect(() => {
	wc.boot();
});
```

## Reactive query patterns (Convex example)

- When passing reactive flags into query factories, pass getters, not values. Example:

```ts
// Good: pass a getter so the query can re-evaluate
const currentUserResponse = createCurrentUserQuery({
	isAuthenticated: () => auth.isAuthenticated,
	initialUser: untrack(() => data.currentUser)
});
```

- If `QueryDeps` expects `isAuthenticated: () => boolean`, ensure you _call_ it inside the factory when computing conditional keys:

```ts
() => (isAuthenticated() ? {} : 'skip');
```

Missing the `()` call will make the condition always truthy (function reference), which breaks the skip logic.

## Services / factories / context: roles clarified

- `services/domain/*` — define what services do (classes). One file per service is fine here.
- `factories/create-services.ts` — group factory functions that construct service instances. One file may create multiple services.
- `context/context-services.ts` — provide `set`/`get` helpers for each service. Keep these thin and predictable.

Why both `factories` and `context` may mention `services`:

- `factories` answers "how do I construct this instance?"
- `context` answers "how do I make this instance available to components?"

## Finder refactor guidance (concrete changes)

- Extract pure view logic (icons, colors, view mapping) into `selectors.svelte.ts`.
  - Example selectors to add:
    - `selectNodeIcon(node: FinderNode): string`
    - `selectNodeColor(node: FinderNode): string`
    - `selectWcView(status: WebContainerState['status'])`

- `FinderRow.svelte` — remove inline `EXT_ICONS` / `EXT_COLORS` maps and use selectors:

```diff
- const icon  = $derived(node.kind === 'dir' ? '󰉋' : (EXT_ICONS[ext] ?? '󰈔'));
- const color = $derived(node.kind === 'dir' ? 'var(--c-dir)' : (EXT_COLORS[ext] ?? 'var(--c-file)'));
+ const icon  = $derived(selectNodeIcon(node));
+ const color = $derived(selectNodeColor(node));
```

- `FinderToolbar.svelte` — use `selectWcView` instead of checking `wcService.status` inline. Restore context imports and `$props()` if they were dropped:

```diff
+ import { getFinderContext, getWebContainerContext } from '$lib/context/context-services';
+ let { onsearch }: { onsearch?: (query: string) => void } = $props();
```

## SSR data flow pattern for Dashboard

1. `+page.server.ts` loads `currentUser` and attaches it to `data`.
2. `+page.svelte` forwards `data` as a prop to `Dashboard`.
3. `dashboard.svelte` seeds client queries with `initialUser: untrack(() => data.currentUser)` and uses a selector like `selectUser(live, server)` to prefer live data when available.

This gives a fast initial render while remaining live after hydration.

## Small UX / production notes

- Do not silently swallow errors with `console.error`. Surface them to a toast or an error state in production so users see failures.

## Suggested small checklist for PRs

- [ ] Filenames use kebab-case
- [ ] Hooks accept injected deps and export pure guards
- [ ] No side effects at module init; use `$effect` for lifecycle booting
- [ ] Query factories accept getters for reactive flags
- [ ] Extract pure view logic into selectors and reuse across components
- [ ] Factories create services; context distributes them
- [ ] Restore `$props()` and context imports after refactors

---

If you'd like, I can:

- Produce the concrete `selectors.svelte.ts` file and apply the `FinderRow` / `FinderToolbar` diffs in the repo.
- Rename `useWebcontainer.svelte.ts` → `use-webcontainer.svelte.ts` and update imports across the codebase.
- Generate a sequence diagram for the SSR → Dashboard → Finder flow.

Tell me which of these you'd like me to apply next and I'll update the todo list and make the edits.
