import { todayISO } from "../dates";
import { buildMockData } from "../mock-data";
import type { Message, Notice, Program, Store } from "./types";

type State = {
  programs: Program[];
  notices: Notice[];
  messages: Message[];
  visitDays: Map<string, number>;
  sessions: Map<string, number>;
  nextId: number;
};

const ONLINE_WINDOW_MS = 2 * 60_000;
const globalForMock = globalThis as unknown as { mockState?: State };

function state(): State {
  if (globalForMock.mockState) return globalForMock.mockState;
  const data = buildMockData(todayISO());
  let id = 1;
  globalForMock.mockState = {
    programs: data.programs.map((p) => ({ ...p, id: id++ })),
    notices: data.notices.map((n) => ({ ...n, id: id++ })),
    messages: data.messages.map((m) => ({ ...m, id: id++ })),
    visitDays: new Map(data.visits.map((v) => [v.day, v.count])),
    sessions: new Map(),
    nextId: id,
  };
  return globalForMock.mockState;
}

const take = <T>(rows: T[], limit?: number) => (limit ? rows.slice(0, limit) : rows);
const byNewest = (a: { createdAt: Date; id: number }, b: { createdAt: Date; id: number }) =>
  b.createdAt.getTime() - a.createdAt.getTime() || b.id - a.id;

export const mockStore: Store = {
  kind: "mock",

  async listPrograms(limit) {
    return take([...state().programs].sort(byNewest), limit);
  },
  async addProgram(input) {
    const s = state();
    s.programs.push({ ...input, id: s.nextId++, createdAt: new Date() });
  },
  async removeProgram(id) {
    const s = state();
    s.programs = s.programs.filter((p) => p.id !== id);
  },

  async listNotices(limit) {
    const sorted = [...state().notices].sort(
      (a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date) || byNewest(a, b),
    );
    return take(sorted, limit);
  },
  async addNotice(input) {
    const s = state();
    s.notices.push({ ...input, id: s.nextId++, createdAt: new Date() });
  },
  async removeNotice(id) {
    const s = state();
    s.notices = s.notices.filter((n) => n.id !== id);
  },

  async listMessages() {
    return [...state().messages].sort(byNewest);
  },
  async addMessage(input) {
    const s = state();
    s.messages.push({ ...input, id: s.nextId++, createdAt: new Date() });
  },
  async removeMessage(id) {
    const s = state();
    s.messages = s.messages.filter((m) => m.id !== id);
  },

  async counts() {
    const s = state();
    return { programs: s.programs.length, notices: s.notices.length, messages: s.messages.length };
  },

  async visits(today) {
    const s = state();
    const cutoff = Date.now() - ONLINE_WINDOW_MS;
    let total = 0;
    for (const count of s.visitDays.values()) total += count;
    const online = [...s.sessions.values()].filter((seen) => seen > cutoff).length;
    return { total, today: s.visitDays.get(today) ?? 0, online };
  },
  async recordVisit(sessionId, isNewVisit, today) {
    const s = state();
    s.sessions.set(sessionId, Date.now());
    if (isNewVisit) s.visitDays.set(today, (s.visitDays.get(today) ?? 0) + 1);
  },
};

