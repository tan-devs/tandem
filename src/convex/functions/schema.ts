import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	profiles: defineTable({
		userId: v.string()
	}).index('userId', ['userId']),

	projects: defineTable({
		ownerId: v.string(), // better-auth user _id
		name: v.string(),
		description: v.optional(v.string()),
		createdAt: v.number(),
		updatedAt: v.number()
	})
		.index('ownerId', ['ownerId'])
		.index('ownerId_updatedAt', ['ownerId', 'updatedAt']),

	// File tree: each node is either a file or folder
	nodes: defineTable({
		projectId: v.id('projects'),
		parentId: v.optional(v.id('nodes')), // null = root
		name: v.string(),
		type: v.union(v.literal('file'), v.literal('folder')),
		// Only present on files — the Liveblocks room ID for this file's editor
		roomId: v.optional(v.string()),
		// Ordering within parent
		order: v.number(),
		createdAt: v.number(),
		updatedAt: v.number()
	})
		.index('projectId', ['projectId'])
		.index('parentId', ['parentId'])
		.index('projectId_parentId', ['projectId', 'parentId']),

	content: defineTable({
		nodeId: v.id('nodes'),
		projectId: v.id('projects'), // denormalized for easy project-level queries
		text: v.string(),
		updatedAt: v.number()
	})
		.index('nodeId', ['nodeId'])
		.index('projectId', ['projectId'])
});
