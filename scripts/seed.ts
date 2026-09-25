import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import seed from "../content/seed.json";
import { notices, programs } from "../src/db/schema";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const existing = await db.select({ id: programs.id }).from(programs).limit(1);
  if (existing.length && !process.argv.includes("--force")) {
    console.log("Database already has data. Run with --force to seed anyway.");
    return pool.end();
  }

  const base = Date.now();
  await db.insert(programs).values(
    seed.programs.map((p, i) => ({ ...p, images: [], createdAt: new Date(base - i * 60_000) })),
  );
  await db.insert(notices).values(seed.notices);

  console.log(`Seeded ${seed.programs.length} programs and ${seed.notices.length} notices.`);
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
