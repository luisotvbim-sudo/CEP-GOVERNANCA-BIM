import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const assets = sqliteTable('assets', {
 id: text('id').primaryKey(), name: text('name').notNull(), kind: text('kind').notNull(),
 discipline: text('discipline').notNull(), category: text('category').notNull(),
 version: text('version').notNull(), status: text('status').notNull(),
 description: text('description').notNull(), links: text('links').notNull(),
 fileKey: text('file_key'), fileName: text('file_name'), updatedAt: text('updated_at').notNull()
});
export const authAttempts = sqliteTable('auth_attempts', {
 ipHash: text('ip_hash').primaryKey(), windowStart: integer('window_start').notNull(),
 attempts: integer('attempts').notNull(), failures: integer('failures').notNull(),
 blockedUntil: integer('blocked_until').notNull()
});
