import type { FunctionReturnType } from 'convex/server';
import type { api } from '$convex/functions/_generated/api.js';

// Derived directly from what getCurrentUser actually returns —
// no hand-writing, never drifts from the backend
export type CurrentUser = NonNullable<FunctionReturnType<typeof api.auth.getCurrentUser>>;
