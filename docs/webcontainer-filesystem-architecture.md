# WebContainer and Filesystem Architecture

This document explains how the WebContainer-backed filesystem works in this codebase, moving from the lowest-level helpers up to the Svelte UI that renders and edits the tree. It is meant as a developer-facing guide for understanding the current data flow and for extending the system safely.

## Overview

The system is built in layers:

1. **Low-level helpers** talk directly to the WebContainer API and normalize data.
2. **Domain services** wrap those helpers in stateful, reusable classes.
3. **Svelte hooks** expose a component-friendly API and preserve per-tab singleton behavior.
4. **UI components** consume the services through Svelte context and render the Finder interface.

The important design goal is separation of concerns:

- filesystem traversal is pure and reusable
- WebContainer booting is centralized and singleton-based
- UI components do not know how booting or traversal work internally
- state changes always flow downward into the rendered Finder tree

---

## Core data model

### `FinderNode`

The filesystem tree is normalized into `FinderNode` objects. A node is either:

- a **file**: `{ kind: 'file', name, path }`
- a **directory**: `{ kind: 'dir', name, path, children }`

This format is the bridge between the WebContainer filesystem and the Finder UI.

### WebContainer runtime state

The WebContainer side is represented by a small state machine:

- `idle` — the container has not been started yet
- `booting` — the container is starting
- `ready` — the container is available and the filesystem tree has been read
- `error` — booting or filesystem loading failed

This state is kept in both the hook and the service class, with the same shape.

---

## Low-level filesystem layer

### `src/lib/utils/filesystem.ts`

The main pure helper here is `readDir(wc, dirPath)`.

What it does:

1. calls `wc.fs.readdir(dirPath, { withFileTypes: true })`
2. iterates the entries returned by WebContainer
3. converts each entry into a `FinderNode`
4. recursively reads child directories
5. sorts results so directories appear before files, then alphabetically within each group

### Why this layer matters

This function is intentionally free of UI and state concerns. It only knows how to:

- walk the WebContainer filesystem
- convert WebContainer directory entries into application data
- return a tree that the rest of the app can consume

That makes it the best place for future filesystem rules such as:

- filtering hidden files
- excluding build artifacts
- adding metadata like file size or type
- changing sort behavior

If a future change needs to alter how the tree is built, this is the first place to look.

---

## Shared WebContainer utilities

### `src/lib/utils/webcontainer.ts`

This file contains helpers that are shared by the hook and the service.

#### `WebContainerBootFn`

A small type alias describing any function that returns `Promise<WebContainer>`.

This is the injection seam for testing or custom boot behavior.

#### `createSingletonBooter(boot)`

This creates a closure around a boot function and ensures there is only one active WebContainer instance per browser tab.

Behavior:

- if an instance already exists, return it immediately
- if a boot is already in progress, reuse that promise
- otherwise, call the injected `boot()` function
- store the resolved instance for future calls

This function is important because WebContainer initialization is expensive and should not be repeated across components.

#### `toWebContainerError(err)`

Normalizes unknown errors into a string.

This keeps the UI state simple and avoids leaking raw exception shapes into components.

---

## Domain service layer

### `src/lib/services/domain/webcontainer.svelte.ts`

`WebContainerService` is the stateful wrapper around the raw WebContainer API.

It owns:

- the current status
- the WebContainer instance
- the current normalized filesystem tree
- file mutation operations

#### Constructor dependencies

The service accepts two injectable dependencies:

- `boot?: WebContainerBootFn`
- `readDir?: typeof readDir`

By default it uses:

- `WebContainer.boot()` for runtime booting
- `readDir` from `src/lib/utils/filesystem.ts` for tree building

This means the service can be tested with fake boot logic and fake filesystem traversal.

#### `boot()`

Flow:

1. if already `ready` or `booting`, do nothing
2. set state to `booting`
3. call the singleton boot function
4. read the entire filesystem tree with `readTree(wc, '/')`
5. store the ready state with the WebContainer instance and tree
6. on error, store a normalized error message

#### `refresh()`

Re-reads the filesystem tree from the current WebContainer instance.

This is used after mutations so the UI always reflects the latest structure.

#### `readFile(path)`

Reads file contents from the WebContainer filesystem.

This returns raw file text and is used by the Finder preview / open flow.

#### `writeFile(path, content)`

Writes file contents, then refreshes the tree.

#### `mkdir(path)`

Creates a directory, then refreshes the tree.

#### `rm(path, recursive)`

Deletes a file or directory, then refreshes the tree.

### Service responsibility summary

The service is the main bridge between the WebContainer runtime and the app state.
It translates low-level filesystem operations into higher-level operations the UI can call.

---

## Hook layer

### `src/lib/hooks/useWebcontainer.svelte.ts`

This hook provides the same behavior as the service class, but in a Svelte runes-friendly form.

It uses:

- `createSingletonBooter(...)`
- shared `readDir(...)`
- `toWebContainerError(...)`

It also accepts the same injectable dependencies:

- `boot?: WebContainerBootFn`
- `readDir?: typeof readDir`

### Hook behavior

The hook returns a stateful object with:

- getters for `status`, `instance`, `fs`, and `error`
- operations `boot`, `refresh`, `readFile`, `writeFile`, `mkdir`, `rm`

#### `boot()` flow

1. prevent duplicate boots
2. set local state to `booting`
3. get or reuse the singleton WebContainer
4. build the filesystem tree
5. move to `ready`
6. on failure, move to `error`

#### Why the hook still exists

The hook is the component-facing version of the service layer.
It is useful when a component wants a direct WebContainer controller without using the class-based service wrapper.

---

## Factory layer

### `src/lib/factories/services.ts`

The factory functions create the app-facing service objects.

#### `createWebContainerService(options?)`

Creates a `WebContainerService` instance and forwards optional injected dependencies.

#### `createFinderService(wcService, onopen?)`

Creates a `FinderService` tied to a given WebContainer service.

This is the top-level service construction point used by the Finder UI.

---

## Finder service and UI flow

### `src/lib/services/domain/finder.svelte.ts`

`FinderService` owns Finder-specific state and user interactions.

It stores:

- browsing history
- current selected path
- preview state
- context menu state
- create-file/create-folder state
- sidebar selection

It depends on a `WebContainerService`, which means it does not interact with the raw WebContainer API directly.

### Finder actions

The service exposes operations such as:

- `back()` / `forward()`
- `goToPath(path)`
- `sidebarClick(item)`
- `selectNode(node)`
- `openFile(node)`
- `onContextMenu(event, node)`
- `ctxDelete(node)`
- `startCreate(kind)`
- `commitCreate()`
- `clearContextMenu()`
- `clearCreating()`

These operations mainly mutate Finder state and call into the WebContainer service for file operations.

### `src/components/home/finder/FinderBody.svelte`

This component wires everything together.

It:

1. receives the WebContainer hook instance from `Dashboard`
2. creates a `WebContainerService`
3. sets the service into Svelte context
4. creates a `FinderService`
5. sets the Finder service into Svelte context
6. renders the toolbar, content, and context menu

This component is the main orchestration layer for the Finder feature.

### `src/components/home/finder/FinderToolbar.svelte`

The toolbar consumes the Finder and WebContainer contexts.

It reads:

- current selected path
- WebContainer status
- Finder navigation methods

It renders:

- back/forward buttons
- current path display
- search input
- boot / new file / new folder / refresh actions

### `src/components/home/finder/FinderContent.svelte`

This component renders the Finder body:

- sidebar
- file list
- preview pane
- create row, if active

It reads the shared Finder context and turns service state into UI.

---

## End-to-end data flow

This is the full lifecycle from app startup to file editing.

### 1. Dashboard creates the hook

`Dashboard.svelte` calls `useWebContainer()`.

It then triggers `wc.boot()` in an effect so the container starts when the dashboard mounts.

### 2. WebContainer boots

Inside `useWebContainer()` or `WebContainerService`:

- singleton boot logic ensures only one WebContainer is created per tab
- the runtime is started via `WebContainer.boot()`
- the filesystem is read via `readDir(wc, '/')`
- a full `FinderNode[]` tree is stored in state

### 3. FinderBody connects services

`FinderBody.svelte` receives the hook instance and creates higher-level service wrappers.

It then places those services in Svelte context so child components can access them.

### 4. FinderContent renders the tree

`FinderContent.svelte` reads the Finder service state and renders:

- folders/files from `currentChildren`
- selected item highlighting
- preview data
- create row when needed

### 5. User interaction changes service state

Examples:

- selecting a directory updates the current path
- selecting a file reads its contents into preview state
- creating or deleting files calls `writeFile`, `mkdir`, or `rm`
- after every mutation, the tree is refreshed from the WebContainer filesystem

### 6. UI re-renders automatically

Because the services store state with Svelte runes, the UI updates whenever:

- the active path changes
- the tree changes
- the preview changes
- boot state changes
- errors occur

---

## Concrete data flow examples

### Boot flow example

1. `Dashboard` calls `wc.boot()`.
2. `useWebContainer()` sets state to `booting`.
3. `WebContainer.boot()` resolves to a runtime instance.
4. `readDir(wc, '/')` walks the root filesystem.
5. The resulting `FinderNode[]` tree is stored.
6. `FinderBody` and `FinderContent` render the tree.

### File open flow example

1. User clicks a file node in `FinderContent`.
2. `FinderService.selectNode(node)` detects it is a file.
3. The selected path is updated.
4. `WebContainerService.readFile(path)` loads file contents.
5. Preview state is updated.
6. The preview pane displays the content.

### Create file flow example

1. User clicks “New File”.
2. `FinderService.startCreate('file')` sets create mode.
3. User enters a name and confirms.
4. `FinderService.commitCreate()` resolves the final path.
5. `WebContainerService.writeFile(path, '')` writes the file.
6. `refresh()` re-reads the tree.
7. The UI updates with the new file.

### Delete flow example

1. User opens a context menu on a node.
2. `FinderService.ctxDelete(node)` is called.
3. `WebContainerService.rm(path, recursive)` removes the item.
4. `refresh()` re-reads the tree.
5. The Finder view updates.

---

## Where to add future features

### If you want to change filesystem behavior

Start in `src/lib/utils/filesystem.ts`.

Good candidates:

- hidden file filtering
- metadata enrichment
- custom sort order
- ignore rules
- file type detection

### If you want to change runtime boot behavior

Start in `src/lib/utils/webcontainer.ts` and the WebContainer service/hook constructors.

Good candidates:

- custom boot strategies
- dependency injection for tests
- retry/backoff behavior
- telemetry hooks

### If you want to change Finder interaction behavior

Start in `src/lib/services/domain/finder.svelte.ts`.

Good candidates:

- keyboard navigation
- selection rules
- context menu actions
- multi-pane support
- opening files in an editor pane

### If you want to change UI wiring

Start in `src/components/home/finder/FinderBody.svelte`.

Good candidates:

- additional context providers
- alternative Finder layouts
- toolbar actions
- event handling

---

## Developer notes

- Keep filesystem traversal logic pure when possible.
- Keep WebContainer boot state centralized so the app does not create multiple runtime instances accidentally.
- Prefer injecting `boot` and `readDir` in tests instead of mocking globals.
- After any filesystem mutation, refresh the tree so UI and runtime stay in sync.
- Treat `FinderNode[]` as the canonical UI-friendly filesystem shape.

---

## Summary

The architecture is intentionally layered:

- **`readDir`** turns WebContainer filesystem entries into a normalized tree.
- **`createSingletonBooter`** centralizes runtime creation.
- **`WebContainerService`** turns runtime operations into a stateful API.
- **`useWebContainer()`** provides a hook-friendly version of the same behavior.
- **`FinderService`** adds browsing and editing behavior.
- **`FinderBody` / `FinderContent` / `FinderToolbar`** render the UI from shared service state.

This structure keeps the filesystem logic reusable and makes future development easier because each layer has a clear job.

## Convex auth & serverless database (overview)

This repository uses Convex for serverless database and server-side functions. Authentication and database access are handled in Convex functions and config files under `src/convex/functions/`.

- See the companion document for a focused explanation of authentication, identity mapping, and how Convex functions talk to the frontend: [Convex Auth & Serverless Database](docs/convex-auth-and-database.md).

When working on Convex-related code, always read `src/convex/functions/_generated/ai/guidelines.md` first for project-specific Convex rules.

- For developer-facing conventions, architecture decisions, and refactor guidance (naming, DI boundaries, hook purity, selectors), see: [Architecture Guidelines](docs/architecture-guidelines.md).
