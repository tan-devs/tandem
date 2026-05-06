# Convex Auth & Serverless Database

This document explains how Convex is used for authentication and serverless data in this project, how Convex functions and the frontend interact, and where to look in the codebase.

## High-level responsibilities

- Convex functions act as server-side endpoints (queries and mutations) and are the canonical place for access control and data validation.
- Authentication identities are surfaced to Convex via the Convex Auth integration (or a similar identity provider configured in `auth.config.ts`).
- The frontend calls Convex queries/mutations through the Convex client; sensitive operations run server-side inside Convex functions.

## Key files to inspect

- `src/convex/functions/auth.config.ts` — Convex auth configuration and identity provider mappings.
- `src/convex/functions/auth.ts` — auth-related server functions (login helpers, identity helpers, session logic).
- `src/convex/functions/schema.ts` — Convex schema: tables and field definitions.
- `src/convex/functions/profiles.ts` — example table-specific queries/mutations (user profile handling).
- `src/convex/functions/_generated/ai/guidelines.md` — project-specific Convex guidelines (read this before changing Convex code).

## Authentication & identity flow (typical)

1. The frontend performs a sign-in flow using the chosen identity provider (OAuth, third-party, or Convex Auth SDK).
2. Once the provider returns an identity assertion, the frontend exchanges it with Convex (or calls a Convex server function) to create or link a Convex user identity.
3. Convex stores a minimal identity mapping in a `users` (or `profiles`) table — linking external provider IDs to app-level user documents.
4. When calling Convex functions, the runtime exposes `ctx.auth` (or equivalent) to server-side functions; use `ctx.auth.getUserIdentity()` to obtain the current caller identity and enforce access control.

## Serverless DB access patterns

- Favor server-side access control: put authorization checks inside Convex queries/mutations rather than relying on the frontend to enforce rules.
- Keep client queries minimal and safe: the frontend should call thin wrappers (server functions) that validate inputs and scope returned data.
- Use transactions when multiple documents must be updated atomically.

## Example: protect a mutation

Inside a Convex mutation function, check identity first:

- Call `const identity = ctx.auth.getUserIdentity()`.
- If `identity` is null, throw an authorization error.
- Look up the user document by provider id or user id, then perform the mutation only if the user is allowed.

## Deployment & environment

- The frontend uses an environment variable (Convex deployment URL / key) to initialize the Convex client.
- Server-side functions run in the Convex runtime; they do not expose raw DB credentials to the client.

## Testing & local development

- Use dependency injection in Convex functions (or test helpers) when possible so unit tests can stub auth and DB access.
- For local development, run `npx convex dev` (or follow the project README) to start a local Convex runtime.

## Where to extend

- To add providers or change login behavior: modify `auth.config.ts` and `auth.ts` and follow conventions in `_generated/ai/guidelines.md`.
- To add tables or change schemas: update `schema.ts` and add migration scripts or follow the widen-migrate-narrow workflow documented in the Convex migration helper in this repo.

## Troubleshooting tips

- If identities aren't appearing in Convex, confirm the frontend is sending the correct token/assertion and the Convex config accepts that provider.
- Check server logs for thrown authorization errors inside Convex functions.
- Use small, focused Convex functions for debugging (return current `ctx.auth.getUserIdentity()` to verify caller identity).

---

If you'd like, I can: add a short sequence diagram for the auth flow, add concrete code snippets from `auth.ts` showing the exact checks used in this repo, or create a short checklist for adding a new provider.
