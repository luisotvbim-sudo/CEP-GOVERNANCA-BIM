ALTER TABLE `assets` ADD `guid` text;--> statement-breakpoint
CREATE UNIQUE INDEX `assets_guid_unique` ON `assets` (`guid`);--> statement-breakpoint
UPDATE assets SET guid = upper(hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-4' || substr(hex(randomblob(2)), 2) || '-' || substr('89ab', abs(random() % 4) + 1, 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))) WHERE guid IS NULL;
