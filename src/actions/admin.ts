"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { normalizeUsername, isOwnerUsername, requireAdmin } from "@/lib/auth";
import { content } from "@/lib/content";
import { todayISO } from "@/lib/dates";
import { hashPassword } from "@/lib/password";
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

export async function removeMessage(id: number) {
  await requireAdmin();
  await store.removeMessage(id);
  revalidatePath("/admin");
  redirect("/admin?tab=inbox&done=message-removed");
}

const staffSchema = z.object({
  prefix: z.enum(["", ...content.about.faculty.prefixes] as [string, ...string[]]),
  name: z.string().trim().min(1),
  designation: z.string().trim().min(1),
  subject: z.string().trim(),
});

export async function saveStaff(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = staffSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return failure("Name and designation are required.", formData);
  const id = Number(formData.get("id"));
  if (id) {
    await store.updateStaff(id, parsed.data);
    revalidatePath("/about");
    revalidatePath("/admin");
    redirect("/admin?tab=staff&done=staff-updated");
  }
  await store.addStaff(parsed.data);
  revalidatePath("/about");
  revalidatePath("/admin");
  redirect("/admin?tab=staff&done=staff-added");
}

export async function moveStaff(id: number, direction: "up" | "down") {
  await requireAdmin();
  await store.moveStaff(id, direction);
  revalidatePath("/about");
  revalidatePath("/admin");
  redirect("/admin?tab=staff");
}

export async function removeStaff(id: number) {
  await requireAdmin();
  await store.removeStaff(id);
  revalidatePath("/about");
  revalidatePath("/admin");
  redirect("/admin?tab=staff&done=staff-removed");
}

const adminUserSchema = z
  .object({
    username: z
      .string()
      .transform(normalizeUsername)
      .pipe(z.string().regex(/^[a-z0-9._-]{3,32}$/, "Username must be 3–32 characters: letters, numbers, dot, dash or underscore.")),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords do not match.", path: ["confirm"] });

export async function addAdminUser(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = adminUserSchema.safeParse(Object.fromEntries(formData));
  const values = { username: String(formData.get("username") ?? "") };
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };
  const { username, password } = parsed.data;
  if (isOwnerUsername(username) || (await store.findAdminUser(username))) {
    return { error: "That username is already taken.", values };
  }
  await store.addAdminUser({ username, passwordHash: await hashPassword(password) });
  revalidatePath("/admin");
  redirect("/admin?tab=admins&done=admin-added");
}

export async function removeAdminUser(id: number) {
  const session = await requireAdmin();
  const users = await store.listAdminUsers();
  if (users.find((u) => u.id === id)?.username === session.username) redirect("/admin?tab=admins&done=admin-self");
  await store.removeAdminUser(id);
  revalidatePath("/admin");
  redirect("/admin?tab=admins&done=admin-removed");
}
