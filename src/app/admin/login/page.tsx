import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Corners } from "@/components/Corners";
import { getSession } from "@/lib/auth";
import { content } from "@/lib/content";

export const metadata: Metadata = { title: "Staff sign in", robots: { index: false } };

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");
  const { school, admin } = content;
  return (
    <main className="login-screen">
      <div className="blueprint login-card">
        <Corners />
        <div className="login-brand">
          <img src={school.icon} alt={school.logoAlt} width={44} height={44} className="logo-tile" />
          <div className="stack-2">
            <span className="login-school">{school.shortName}</span>
            <span className="text-soft small-13">{admin.title}</span>
          </div>
        </div>
        <h1 className="login-title">{admin.signInTitle}</h1>
        <LoginForm />
        <Link href="/" className="small-14">{admin.backLabel}</Link>
      </div>
    </main>
  );
}
