import { asc, count, desc, eq, gt, max, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import { adminUsers, messages, notices, programs, staff, visitDays, visitorSessions } from "@/db/schema";
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
  async removeMessage(id) {
    await db.delete(messages).where(eq(messages.id, id));
  },

  async listStaff() {
    return db.select().from(staff).orderBy(asc(staff.sortOrder), asc(staff.id));
  },
  async addStaff(input) {
    const [{ value }] = await db.select({ value: max(staff.sortOrder) }).from(staff);
    await db.insert(staff).values({ ...input, sortOrder: (value ?? 0) + 1 });
  },
  async updateStaff(id, input) {
    await db.update(staff).set(input).where(eq(staff.id, id));
  },
  async moveStaff(id, direction) {
    await db.transaction(async (tx) => {
      const rows = await tx.select({ id: staff.id }).from(staff).orderBy(asc(staff.sortOrder), asc(staff.id));
      const ids = rows.map((r) => r.id);
      const from = ids.indexOf(id);
      const to = direction === "up" ? from - 1 : from + 1;
      if (from < 0 || to < 0 || to >= ids.length) return;
      [ids[from], ids[to]] = [ids[to], ids[from]];
      for (const [i, rowId] of ids.entries()) {
        await tx.update(staff).set({ sortOrder: i + 1 }).where(eq(staff.id, rowId));
      }
    });
  },
  async removeStaff(id) {
    await db.delete(staff).where(eq(staff.id, id));
  },

  async listAdminUsers() {
    return db.select().from(adminUsers).orderBy(asc(adminUsers.createdAt), asc(adminUsers.id));
  },
  async findAdminUser(username) {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username)).limit(1);
    return user;
  },
  async addAdminUser(input) {
    await db.insert(adminUsers).values(input);
  },
  async removeAdminUser(id) {
    await db.delete(adminUsers).where(eq(adminUsers.id, id));
  },

  async counts() {
    const [[p], [n], [m], [s]] = await Promise.all([
      db.select({ value: count() }).from(programs),
      db.select({ value: count() }).from(notices),
      db.select({ value: count() }).from(messages),
      db.select({ value: count() }).from(staff),
    ]);
    return { programs: p.value, notices: n.value, messages: m.value, staff: s.value };
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
