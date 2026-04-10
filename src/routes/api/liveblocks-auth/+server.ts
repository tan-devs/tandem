import type { RequestEvent } from '@sveltejs/kit';
import { LIVEBLOCKS_SECRET_KEY } from '$env/static/private';
import { PUBLIC_CONVEX_URL } from '$env/static/public';
import { Liveblocks } from '@liveblocks/node';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '$convex/functions/_generated/api.js';

const liveblocks = new Liveblocks({ secret: LIVEBLOCKS_SECRET_KEY });

export async function POST({ locals, request }: RequestEvent): Promise<Response> {
	try {
		if (!locals.token) {
			return new Response('Unauthorized', { status: 401 });
		}

		const { room } = await request.json();

		if (room !== undefined) {
			if (typeof room !== 'string' || room.trim().length === 0) {
				return new Response('Invalid room ID', { status: 400 });
			}
		}

		const convex = new ConvexHttpClient(PUBLIC_CONVEX_URL);
		convex.setAuth(locals.token);

		const user = await convex.query(api.auth.getCurrentUser, {});
		if (!user) return new Response('Unauthorized', { status: 401 });

		const session = liveblocks.prepareSession(user._id, {
			userInfo: {
				name: user.name?.trim() || 'Anonymous',
				email: user.email?.trim() || '',
				avatar: user.image?.trim() || ''
			}
		});

		if (room) {
			session.allow(room, session.FULL_ACCESS);
		}

		const { status, body } = await session.authorize();
		return new Response(body, { status });
	} catch (error) {
		console.error('Liveblocks auth error:', error);
		return new Response('Internal Server Error', { status: 500 });
	}
}
