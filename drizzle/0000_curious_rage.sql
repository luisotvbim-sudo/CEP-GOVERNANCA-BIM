CREATE TABLE `assets` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`kind` text NOT NULL,
	`discipline` text NOT NULL,
	`category` text NOT NULL,
	`version` text NOT NULL,
	`status` text NOT NULL,
	`description` text NOT NULL,
	`links` text NOT NULL,
	`file_key` text,
	`file_name` text,
	`updated_at` text NOT NULL
);
