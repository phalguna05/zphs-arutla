import mock from "@content/mock-data.json";
import type { NewMessage, NewNotice, NewProgram, NewStaffMember } from "./store/types";

type MockProgram = Omit<NewProgram, "images">;
type MockNotice = Omit<NewNotice, "date" | "attachmentUrl"> & { daysAgo: number };
type MockMessage = NewMessage & { daysAgo: number };

const data = mock as {
  programs: MockProgram[];
  notices: MockNotice[];
  messages: MockMessage[];
  staff?: NewStaffMember[];
  visits: { daily: number[] };
};

function isoDaysAgo(today: string, days: number) {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

/** Mock records with dates resolved relative to `today`, so "New" tags and the inbox always look current. */
export function buildMockData(today: string, now = Date.now()) {
  const programs = data.programs.map((p, i) => ({
    ...p,
    images: [] as string[],
    createdAt: new Date(now - i * 60_000),
  }));
  const notices = data.notices.map(({ daysAgo, ...n }, i) => ({
    ...n,
    date: isoDaysAgo(today, daysAgo),
    attachmentUrl: null,
    createdAt: new Date(now - i * 60_000),
  }));
  const messages = data.messages.map(({ daysAgo, ...m }) => ({
    ...m,
    createdAt: new Date(now - daysAgo * 86_400_000 - 3_600_000),
  }));
  const visits = data.visits.daily.map((count, i) => ({ day: isoDaysAgo(today, i), count }));
  const staff = (data.staff ?? []).map((m, i) => ({ ...m, sortOrder: i + 1, createdAt: new Date(now + i) }));
  return { programs, notices, messages, staff, visits };
}
