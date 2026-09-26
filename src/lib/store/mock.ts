import { todayISO } from "../dates";
import { buildMockData } from "../mock-data";
import type { AdminUser, Message, Notice, Program, StaffMember, Store } from "./types";

type State = {
  programs: Program[];
  notices: Notice[];
  messages: Message[];
  staff: StaffMember[];
  adminUsers: AdminUser[];
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
    staff: data.staff.map((m) => ({ ...m, id: id++ })),
    adminUsers: [],
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

  async listStaff() {
    return [...state().staff].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  },
  async addStaff(input) {
    const s = state();
    const sortOrder = Math.max(0, ...s.staff.map((m) => m.sortOrder)) + 1;
    s.staff.push({ ...input, id: s.nextId++, sortOrder, createdAt: new Date() });
  },
  async updateStaff(id, input) {
    const s = state();
    s.staff = s.staff.map((m) => (m.id === id ? { ...m, ...input } : m));
  },
  async moveStaff(id, direction) {
    const list = await mockStore.listStaff();
    const from = list.findIndex((m) => m.id === id);
    const to = direction === "up" ? from - 1 : from + 1;
    if (from < 0 || to < 0 || to >= list.length) return;
    [list[from], list[to]] = [list[to], list[from]];
    list.forEach((m, i) => (m.sortOrder = i + 1));
  },
  async removeStaff(id) {
    const s = state();
    s.staff = s.staff.filter((m) => m.id !== id);
  },

  async listAdminUsers() {
    return [...state().adminUsers];
  },
  async findAdminUser(username) {
    return state().adminUsers.find((u) => u.username === username);
  },
  async addAdminUser(input) {
    const s = state();
    if (s.adminUsers.some((u) => u.username === input.username)) throw new Error("duplicate username");
    s.adminUsers.push({ ...input, id: s.nextId++, createdAt: new Date() });
  },
  async removeAdminUser(id) {
    const s = state();
    s.adminUsers = s.adminUsers.filter((u) => u.id !== id);
  },

  async counts() {
    const s = state();
    return { programs: s.programs.length, notices: s.notices.length, messages: s.messages.length, staff: s.staff.length };
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

