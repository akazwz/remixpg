import { IdbFs, PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "~/schema";

export const pg = new PGlite({
  fs: new IdbFs("remix-pglite"),
  extensions: {
    live,
  },
});

export const drizzleDB = drizzle(pg, {
  schema,
});

const migrateSqlStr = `
CREATE TABLE IF NOT EXISTS "todos" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar(256),
	"done" boolean,
	"created_at" timestamp,
	"updated_at" timestamp
);`;

await pg.exec(migrateSqlStr);
