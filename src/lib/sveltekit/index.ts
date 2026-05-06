import { createCookieGetter } from 'better-auth/cookies';
import type { Cookies, RequestHandler } from '@sveltejs/kit';
import { JWT_COOKIE_NAME } from '@convex-dev/better-auth/plugins';
import { PUBLIC_CONVEX_SITE_URL, PUBLIC_CONVEX_URL } from '$env/static/public';
import { ConvexHttpClient, type ConvexClientOptions } from 'convex/browser';
import { _getServerToken } from '@mmailaender/convex-svelte/sveltekit';
import { getAuthOptions } from '$convex/functions/auth';
import type { BetterAuthOptions } from 'better-auth';

/**
 * Initial auth state that can be passed from server to client.
 * Used to avoid loading flash on initial page render.
 */
export type InitialAuthState = {
	isAuthenticated: boolean;
};

export const getToken = async (cookies: Cookies) => {
	const options = getAuthOptions as BetterAuthOptions;
	const createCookie = createCookieGetter(options);
	const cookie = createCookie(JWT_COOKIE_NAME);
	const token = cookies.get(cookie.name);

	if (!token) {
		const isSecure = cookie.name.startsWith('__Secure-');
		const insecureCookieName = cookie.name.replace('__Secure-', '');
		const secureCookieName = isSecure ? cookie.name : `__Secure-${insecureCookieName}`;

		const insecureValue = cookies.get(insecureCookieName);
		const secureValue = cookies.get(secureCookieName);

		// If we expected secure and found insecure set
		if (isSecure && insecureValue) {
			console.warn(
				`Looking for secure cookie "${cookie.name}" but found insecure cookie "${insecureCookieName}". ` +
					`This typically happens behind a reverse proxy. Consider aligning your baseURL with the external URL.`
			);
			return insecureValue;
		}

		// If we expected insecure and found secure set
		if (!isSecure && secureValue) {
			console.warn(
				`Looking for insecure cookie "${cookie.name}" but found secure cookie "${secureCookieName}". ` +
					`This typically happens behind a reverse proxy. Consider aligning your baseURL with the external URL.`
			);
			return secureValue;
		}
	}

	return token;
};

/**
 * Get initial auth state for SSR.
 *
 * When `withServerConvexToken` is set up in `hooks.server.ts`, call with
 * **no arguments** — the token is read automatically from the request context:
 *
 * @example
 * ```ts
 * // +layout.server.ts (recommended — requires withServerConvexToken in hooks.server.ts)
 * import { getAuthState } from '@mmailaender/convex-better-auth-svelte/sveltekit';
 *
 * export const load = async () => ({
 *   authState: getAuthState()
 * });
 * ```
 *
 */
export function getAuthState(): InitialAuthState;
export function getAuthState(): InitialAuthState {
	// 1. Try AsyncLocalStorage (zero-cost when withServerConvexToken is active)
	const serverToken = _getServerToken();
	if (serverToken !== undefined) {
		return { isAuthenticated: true };
	}

	// 2. No token context — unauthenticated
	return { isAuthenticated: false };
}

export const createConvexHttpClient = (
	args: {
		token?: string;
		convexUrl?: string;
		options?: {
			skipConvexDeploymentUrlCheck?: boolean;
			logger?: ConvexClientOptions['logger'];
		};
	} = {}
) => {
	const client = new ConvexHttpClient(args.convexUrl ?? PUBLIC_CONVEX_URL, args.options);
	const token = args.token ?? _getServerToken();
	if (token) client.setAuth(token);
	return client;
};

const handler = (request: Request, opts?: { convexSiteUrl?: string }) => {
	const requestUrl = new URL(request.url);
	const convexSiteUrl = opts?.convexSiteUrl ?? PUBLIC_CONVEX_SITE_URL;

	if (!convexSiteUrl) {
		throw new Error('PUBLIC_CONVEX_SITE_URL environment variable is not set');
	}

	const nextUrl = `${convexSiteUrl}${requestUrl.pathname}${requestUrl.search}`;
	const newRequest = new Request(nextUrl, request);
	newRequest.headers.set('host', new URL(nextUrl).host);
	newRequest.headers.set('accept-encoding', 'application/json');

	return fetch(newRequest, { method: request.method, redirect: 'manual' });
};

export const createSvelteKitHandler = (opts?: { convexSiteUrl?: string }) => {
	const requestHandler: RequestHandler = async ({ request }) => {
		return handler(request, opts);
	};

	return {
		GET: requestHandler,
		POST: requestHandler
	};
};
