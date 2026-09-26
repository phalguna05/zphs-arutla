import { boolean, date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  duration: text("duration").notNull(),
  coordinator: text("coordinator").notNull(),
  description: text("description").notNull(),
  images: text("images").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  date: date("date").notNull(),
  pinned: boolean("pinned").notNull().default(false),
  body: text("body").notNull(),
  attachmentUrl: text("attachment_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const visitDays = pgTable("visit_days", {
  day: date("day").primaryKey(),
  count: integer("count").notNull().default(0),
});

export const visitorSessions = pgTable("visitor_sessions", {
  id: text("id").primaryKey(),
  lastSeen: timestamp("last_seen", { withTimezone: true }).notNull().defaultNow(),
});

export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  prefix: text("prefix").notNull().default(""),
  name: text("name").notNull(),
  designation: text("designation").notNull(),
  subject: text("subject").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Program = typeof programs.$inferSelect;
export type Notice = typeof notices.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type StaffMember = typeof staff.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
