import "server-only";
import { content } from "./content";
import { daysBetween, formatDate, todayISO } from "./dates";
import { store, type Notice, type VisitorStats } from "./store";

export type NoticeView = Notice & { day: string; month: string; dateLabel: string; isNew: boolean };

function toView(notice: Notice, today: string): NoticeView {
  const { day, month, full } = formatDate(notice.date);
  const age = daysBetween(notice.date, today);
  return { ...notice, day, month, dateLabel: full, isNew: age >= 0 && age <= content.notices.newForDays };
}

export const isMockData = () => store.kind === "mock";

export async function getNotices(limit?: number) {
  const today = todayISO();
  return (await store.listNotices(limit)).map((n) => toView(n, today));
}

export const getPrograms = (limit?: number) => store.listPrograms(limit);
export const getMessages = () => store.listMessages();
export const getCounts = () => store.counts();

export async function getVisitorStats(): Promise<VisitorStats> {
  const stats = await store.visits(todayISO());
  return { ...stats, total: content.visitorCounter.startFrom + stats.total };
}

export const recordVisit = (sessionId: string, isNewVisit: boolean) =>
  store.recordVisit(sessionId, isNewVisit, todayISO());
