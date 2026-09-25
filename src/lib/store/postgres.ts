import { count, desc, eq, gt, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import { messages, notices, programs, visitDays, visitorSessions } from "@/db/schema";
import type { Store } from "./types";

const ONLINE_WINDOW = sql`now() - interval '2 minutes'`;

export const postgresStore: Store = {
  kind: "postgres",

  async listPrograms(limit) {
    const query = db.select().from(programs).orderBy(desc(programs.createdAt), desc(programs.id));
    return limit ? query.limit(limit) : query;
  },
  async addProgram(input) {
    await db.insert(programs).values(input);
  },
  async removeProgram(id) {
    await db.delete(programs).where(eq(programs.id, id));
  },

  async listNotices(limit) {
    const query = db.select().from(notices).orderBy(desc(notices.pinned), desc(notices.date), desc(notices.createdAt));
    return limit ? query.limit(limit) : query;
  },
  async addNotice(input) {
    await db.insert(notices).values(input);
  },
  async removeNotice(id) {
    await db.delete(notices).where(eq(notices.id, id));
  },

  async listMessages() {
    return db.select().from(messages).orderBy(desc(messages.createdAt));
  },
  async addMessage(input) {
    await db.insert(messages).values(input);
  },

  async counts() {
    const [[p], [n], [m]] = await Promise.all([
      db.select({ value: count() }).from(programs),
      db.select({ value: count() }).from(notices),
      db.select({ value: count() }).from(messages),
    ]);
    return { programs: p.value, notices: n.value, messages: m.value };
  },

  async visits(today) {
    const [[all], [todayRow], [online]] = await Promise.all([
      db.select({ value: sum(visitDays.count).mapWith(Number) }).from(visitDays),
      db.select({ value: visitDays.count }).from(visitDays).where(eq(visitDays.day, today)),
      db.select({ value: count() }).from(visitorSessions).where(gt(visitorSessions.lastSeen, ONLINE_WINDOW)),
    ]);
    return { total: all?.value ?? 0, today: todayRow?.value ?? 0, online: online.value };
  },
  async recordVisit(sessionId, isNewVisit, today) {
    await db
      .insert(visitorSessions)
      .values({ id: sessionId })
      .onConflictDoUpdate({ target: visitorSessions.id, set: { lastSeen: sql`now()` } });
    if (isNewVisit) {
      await db
        .insert(visitDays)
        .values({ day: today, count: 1 })
        .onConflictDoUpdate({ target: visitDays.day, set: { count: sql`${visitDays.count} + 1` } });
    }
    if (Math.random() < 0.05) {
      await db.delete(visitorSessions).where(sql`${visitorSessions.lastSeen} < now() - interval '1 day'`);
    }
  },
};
