CREATE TABLE `auth_attempts` (
	`ip_hash` text PRIMARY KEY NOT NULL,
	`window_start` integer NOT NULL,
	`attempts` integer NOT NULL,
	`failures` integer NOT NULL,
	`blocked_until` integer NOT NULL
);
