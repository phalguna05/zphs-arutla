import "server-only";
import { count, desc, gt, sql, sum } from "drizzle-orm";
import { db } from "@/db";
import { messages, notices, programs, visitDays, visitorSessions, type Notice } from "@/db/schema";
import { content } from "./content";
import { daysBetween, formatDate, todayISO } from "./dates";

export type NoticeView = Notice & { day: string; month: string; dateLabel: string; isNew: boolean };

function toView(notice: Notice, today: string): NoticeView {
  const { day, month, full } = formatDate(notice.date);
  const age = daysBetween(notice.date, today);
  return { ...notice, day, month, dateLabel: full, isNew: age >= 0 && age <= content.notices.newForDays };
}

export async function getNotices(limit?: number) {
  const query = db
    .select()
    .from(notices)
    .orderBy(desc(notices.pinned), desc(notices.date), desc(notices.createdAt));
  const rows = limit ? await query.limit(limit) : await query;
  const today = todayISO();
  return rows.map((n) => toView(n, today));
}

export async function getPrograms(limit?: number) {
  const query = db.select().from(programs).orderBy(desc(programs.createdAt), desc(programs.id));
  return limit ? query.limit(limit) : query;
}

export async function getMessages() {
  return db.select().from(messages).orderBy(desc(messages.createdAt));
}

export async function getCounts() {
  const [[p], [n], [m]] = await Promise.all([
    db.select({ value: count() }).from(programs),
    db.select({ value: count() }).from(notices),
    db.select({ value: count() }).from(messages),
  ]);
  return { programs: p.value, notices: n.value, messages: m.value };
}

export type VisitorStats = { total: number; today: number; online: number };

const ONLINE_WINDOW = sql`now() - interval '2 minutes'`;

export async function getVisitorStats(): Promise<VisitorStats> {
  const today = todayISO();
  const [[all], [todayRow], [online]] = await Promise.all([
    db.select({ value: sum(visitDays.count).mapWith(Number) }).from(visitDays),
    db.select({ value: visitDays.count }).from(visitDays).where(sql`${visitDays.day} = ${today}`),
    db.select({ value: count() }).from(visitorSessions).where(gt(visitorSessions.lastSeen, ONLINE_WINDOW)),
  ]);
  return {
    total: content.visitorCounter.startFrom + (all?.value ?? 0),
    today: todayRow?.value ?? 0,
    online: online.value,
  };
}

export async function recordVisit(sessionId: string, isNewVisit: boolean) {
  const today = todayISO();
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
}
