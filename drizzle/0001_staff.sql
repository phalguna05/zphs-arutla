CREATE TABLE "staff" (
	"id" serial PRIMARY KEY NOT NULL,
	"prefix" text DEFAULT '' NOT NULL,
	"name" text NOT NULL,
	"designation" text NOT NULL,
	"subject" text DEFAULT '' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
