// convex/profiles.ts
import { query } from './_generated/server';
import { authComponent } from './auth';

export const getUserProfile = query({
	args: {},
	handler: async (ctx) => {
		const user = await authComponent.safeGetAuthUser(ctx);
		if (!user) return null;

		const profile = await ctx.db
			.query('profiles')
			.withIndex('userId', (q) => q.eq('userId', user._id))
			.unique();

		return { user, profile };
	}
});
