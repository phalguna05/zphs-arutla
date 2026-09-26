import "./env";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { databaseUrl } from "../src/db/url";

async function main() {
  if (!databaseUrl) {
    console.log("No DATABASE_URL set — skipping migrations (the site will run on mock data).");
    return;
  }
  const pool = new Pool({ connectionString: databaseUrl });
  await migrate(drizzle(pool), { migrationsFolder: "drizzle" });
  console.log("Database migrations applied.");
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
