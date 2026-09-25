"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { content } from "@/lib/content";
import { todayISO } from "@/lib/dates";
import { store } from "@/lib/store";
import { uploadFiles } from "@/lib/upload";

export type FormState = { error?: string; values?: Record<string, string> };

function failure(error: string, formData: FormData): FormState {
  const values: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") values[key] = value;
  });
  return { error, values };
}

function refresh() {
  for (const path of ["/", "/programs", "/notices", "/admin"]) revalidatePath(path);
}

const programSchema = z.object({
  name: z.string().trim().min(1),
  category: z.enum(content.programs.categories as [string, ...string[]]),
  duration: z.string().trim(),
  coordinator: z.string().trim(),
  description: z.string().trim().min(1),
});

export async function addProgram(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = programSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return failure("Program name and description are required.", formData);

  const photos = formData.getAll("photos").filter((f): f is File => f instanceof File).slice(0, 3);
  let images: string[];
  try {
    images = await uploadFiles(photos, "programs");
  } catch (error) {
    console.error(error);
    return failure("Photo upload failed. Please try again.", formData);
  }

  const { duration, coordinator, ...rest } = parsed.data;
  await store.addProgram({
    ...rest,
    duration: duration || "2026–27",
    coordinator: coordinator || "To be announced",
    images,
  });
  refresh();
  redirect("/admin?tab=programs&done=program-added");
}

export async function removeProgram(id: number) {
  await requireAdmin();
  await store.removeProgram(id);
  refresh();
  redirect("/admin?tab=programs&done=program-removed");
}

const noticeSchema = z.object({
  title: z.string().trim().min(1),
  category: z.enum(content.notices.categories as [string, ...string[]]),
  date: z.iso.date().or(z.literal("")),
  body: z.string().trim().min(1),
});

export async function addNotice(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = noticeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return failure("Notice title and details are required.", formData);

  const file = formData.get("attachment");
  let attachmentUrl: string | null = null;
  try {
    [attachmentUrl = null] = await uploadFiles(file instanceof File ? [file] : [], "notices");
  } catch (error) {
    console.error(error);
    return failure("Attachment upload failed. Please try again.", formData);
  }

  await store.addNotice({
    ...parsed.data,
    date: parsed.data.date || todayISO(),
    pinned: formData.get("pinned") === "on",
    attachmentUrl,
  });
  refresh();
  redirect("/admin?tab=notices&done=notice-added");
}

export async function removeNotice(id: number) {
  await requireAdmin();
  await store.removeNotice(id);
  refresh();
  redirect("/admin?tab=notices&done=notice-removed");
}
