import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "app/schema.ts",
  dialect: "postgresql",
  verbose: true,
  strict: true,
});
