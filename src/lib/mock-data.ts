import mock from "@content/mock-data.json";
import type { NewMessage, NewNotice, NewProgram } from "./store/types";

function isoDaysAgo(today: string, days: number) {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/** Mock records with dates resolved relative to `today`, so "New" tags and the inbox always look current. */
export function buildMockData(today: string, now = Date.now()) {
  const programs = mock.programs.map((p, i) => ({
    ...(p satisfies Omit<NewProgram, "images">),
    images: [] as string[],
    createdAt: new Date(now - i * 60_000),
  }));
  const notices = mock.notices.map(({ daysAgo, ...n }, i) => ({
    ...n,
    date: isoDaysAgo(today, daysAgo),
    attachmentUrl: null,
    createdAt: new Date(now - i * 60_000),
  })) satisfies (NewNotice & { createdAt: Date })[];
  const messages = mock.messages.map(({ daysAgo, ...m }) => ({
    ...m,
    createdAt: new Date(now - daysAgo * 86_400_000 - 3_600_000),
  })) satisfies (NewMessage & { createdAt: Date })[];
  const visits = mock.visits.daily.map((count, i) => ({ day: isoDaysAgo(today, i), count }));
  return { programs, notices, messages, visits };
}
