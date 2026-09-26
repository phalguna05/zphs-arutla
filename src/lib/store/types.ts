import type { AdminUser, Message, Notice, Program, StaffMember } from "@/db/schema";

export type { AdminUser, Message, Notice, Program, StaffMember };

export type NewProgram = Pick<Program, "name" | "category" | "duration" | "coordinator" | "description" | "images">;
export type NewNotice = Pick<Notice, "title" | "category" | "date" | "pinned" | "body" | "attachmentUrl">;
export type NewMessage = Pick<Message, "name" | "email" | "phone" | "subject" | "message">;
export type NewStaffMember = Pick<StaffMember, "prefix" | "name" | "designation" | "subject">;
export type NewAdminUser = Pick<AdminUser, "username" | "passwordHash">;
export type VisitorStats = { total: number; today: number; online: number };

export interface Store {
  readonly kind: "postgres" | "mock";
  listPrograms(limit?: number): Promise<Program[]>;
  addProgram(input: NewProgram): Promise<void>;
  removeProgram(id: number): Promise<void>;
  listNotices(limit?: number): Promise<Notice[]>;
  addNotice(input: NewNotice): Promise<void>;
  removeNotice(id: number): Promise<void>;
  listMessages(): Promise<Message[]>;
  addMessage(input: NewMessage): Promise<void>;
  removeMessage(id: number): Promise<void>;
  listStaff(): Promise<StaffMember[]>;
  addStaff(input: NewStaffMember): Promise<void>;
  updateStaff(id: number, input: NewStaffMember): Promise<void>;
  moveStaff(id: number, direction: "up" | "down"): Promise<void>;
  removeStaff(id: number): Promise<void>;
  listAdminUsers(): Promise<AdminUser[]>;
  findAdminUser(username: string): Promise<AdminUser | undefined>;
  addAdminUser(input: NewAdminUser): Promise<void>;
  removeAdminUser(id: number): Promise<void>;
  counts(): Promise<{ programs: number; notices: number; messages: number; staff: number }>;
  visits(today: string): Promise<{ total: number; today: number; online: number }>;
  recordVisit(sessionId: string, isNewVisit: boolean, today: string): Promise<void>;
}
