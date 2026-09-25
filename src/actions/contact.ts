"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { content } from "@/lib/content";
import { store } from "@/lib/store";

export type ContactState = { status: "idle" | "error" | "sent"; error?: string; values?: Record<string, string> };

const schema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim(),
  phone: z.string().trim().max(20).optional(),
  subject: z.enum(content.contact.subjects as [string, ...string[]]),
  message: z.string().trim().min(1).max(5000),
});

export async function sendMessage(_: ContactState, formData: FormData): Promise<ContactState> {
  const { errors } = content.contact;
  const values = Object.fromEntries(formData) as Record<string, string>;
  const parsed = schema.safeParse(values);
  if (!parsed.success) return { status: "error", error: errors.required, values };
  if (!z.email().safeParse(parsed.data.email).success) return { status: "error", error: errors.email, values };

  try {
    await store.addMessage({ ...parsed.data, phone: parsed.data.phone || null });
  } catch (error) {
    console.error(error);
    return { status: "error", error: errors.server, values };
  }
  revalidatePath("/admin");
  return { status: "sent" };
}
