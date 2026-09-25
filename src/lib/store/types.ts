import type { Message, Notice, Program } from "@/db/schema";

export type { Message, Notice, Program };

export type NewProgram = Pick<Program, "name" | "category" | "duration" | "coordinator" | "description" | "images">;
export type NewNotice = Pick<Notice, "title" | "category" | "date" | "pinned" | "body" | "attachmentUrl">;
export type NewMessage = Pick<Message, "name" | "email" | "phone" | "subject" | "message">;
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
  counts(): Promise<{ programs: number; notices: number; messages: number }>;
  visits(today: string): Promise<{ total: number; today: number; online: number }>;
  recordVisit(sessionId: string, isNewVisit: boolean, today: string): Promise<void>;
}
