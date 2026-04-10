import { createClient, type GenericCtx, type AuthFunctions } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { components, internal } from './_generated/api.js';
import { query } from './_generated/server.js';
import { betterAuth } from 'better-auth';
import authConfig from './auth.config.js';

import { type BetterAuthOptions } from 'better-auth';
import { type DataModel } from './_generated/dataModel.js';

const siteUrl = process.env.SITE_URL!;
const secret = process.env.BETTER_AUTH_SECRET;

const authFunctions: AuthFunctions = internal.auth;
export const authComponent = createClient<DataModel>(components.betterAuth, {
	authFunctions,
	triggers: {
		user: {
			onCreate: async (ctx, user) => {
				await ctx.db.insert('profiles', { userId: user._id });
			}
		}
	}
});

export const getAuthOptions = (ctx: GenericCtx<DataModel>) =>
	({
		baseURL: siteUrl,
		secret: secret,
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false
		},
		socialProviders: {
			github: {
				enabled: true,
				clientId: process.env.GITHUB_CLIENT_ID as string,
				clientSecret: process.env.GITHUB_CLIENT_SECRET as string
			}
		},
		plugins: [
			convex({
				authConfig,
				jwksRotateOnTokenGenerationError: true
			})
		]
	}) satisfies BetterAuthOptions;

export const createAuth = (ctx: GenericCtx<DataModel>) => {
	return betterAuth(getAuthOptions(ctx));
};

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		return authComponent.safeGetAuthUser(ctx);
	}
});

export const getPublicData = query({
	args: {},
	handler: async () => {
		return {
			message: 'This is public data',
			timestamp: Date.now()
		};
	}
});
