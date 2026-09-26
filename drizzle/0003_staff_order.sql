ALTER TABLE "staff" ADD COLUMN "sort_order" integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
UPDATE "staff" SET "sort_order" = ranked.position
FROM (SELECT "id", row_number() OVER (ORDER BY "created_at", "id") AS position FROM "staff") AS ranked
WHERE "staff"."id" = ranked."id";
