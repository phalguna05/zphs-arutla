import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { messages, notices, programs, visitDays } from "../src/db/schema";
import { databaseUrl } from "../src/db/url";
import { todayISO } from "../src/lib/dates";
import { buildMockData } from "../src/lib/mock-data";

async function main() {
  if (!databaseUrl) throw new Error("Set DATABASE_URL (e.g. in .env.local) before seeding.");
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);
  const force = process.argv.includes("--force");

  const existing = await db.select({ id: programs.id }).from(programs).limit(1);
  if (existing.length && !force) {
    console.log("Database already has data. Run `npm run db:seed -- --force` to replace it with mock data.");
    return pool.end();
  }

  const data = buildMockData(todayISO());
  await db.transaction(async (tx) => {
    if (force) {
      await tx.delete(programs);
      await tx.delete(notices);
      await tx.delete(messages);
      await tx.delete(visitDays);
    }
    await tx.insert(programs).values(data.programs);
    await tx.insert(notices).values(data.notices);
    await tx.insert(messages).values(data.messages);
    await tx.insert(visitDays).values(data.visits);
  });

  console.log(
    `Seeded ${data.programs.length} programs, ${data.notices.length} notices, ` +
      `${data.messages.length} messages and ${data.visits.length} days of visits.`,
  );
  await pool.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
