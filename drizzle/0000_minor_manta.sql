CREATE TABLE IF NOT EXISTS "todos" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"done" boolean,
	"created_at" timestamp,
	"updated_at" timestamp
);
