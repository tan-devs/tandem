import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	profiles: defineTable({
		userId: v.string()
	}).index('userId', ['userId'])
});
