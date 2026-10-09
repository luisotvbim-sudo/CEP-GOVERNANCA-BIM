import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
export const assets = sqliteTable('assets', {
 id: text('id').primaryKey(), name: text('name').notNull(), kind: text('kind').notNull(),
 discipline: text('discipline').notNull(), category: text('category').notNull(),
 version: text('version').notNull(), status: text('status').notNull(),
 description: text('description').notNull(), links: text('links').notNull(),
 fileKey: text('file_key'), fileName: text('file_name'), updatedAt: text('updated_at').notNull()
});
