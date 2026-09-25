"use server";

import { redirect } from "next/navigation";
import { checkCredentials, createSession, destroySession } from "@/lib/auth";
import { content } from "@/lib/content";

export type SignInState = { error?: string; username?: string };

export async function signIn(_: SignInState, formData: FormData): Promise<SignInState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(username, password)) return { error: content.admin.invalidLogin, username };
  await createSession(username);
  redirect("/admin");
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}
