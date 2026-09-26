import "server-only";
import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import { verifyPassword } from "./password";
import { store } from "./store";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 8;

const isDev = process.env.NODE_ENV !== "production";

// Local development falls back to demo credentials so the site runs before any env vars are set.
const DEV_DEFAULTS = { username: "admin", password: "arutla@2026", secret: "dev-only-secret-change-me-in-production!!" };

function secret() {
  const value = process.env.AUTH_SECRET || (isDev ? DEV_DEFAULTS.secret : undefined);
  if (!value || value.length < 32) throw new Error("AUTH_SECRET must be set to at least 32 characters");
  return new TextEncoder().encode(value);
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export type AccountKind = "owner" | "user";
export type Session = { username: string; kind: AccountKind };

export const normalizeUsername = (username: string) => username.trim().toLowerCase();

/** The owner account comes from ADMIN_USERNAME / ADMIN_PASSWORD and always works, so admins can never be locked out. */
function ownerAccount() {
  const username = process.env.ADMIN_USERNAME || (isDev ? DEV_DEFAULTS.username : undefined);
  const password = process.env.ADMIN_PASSWORD || (isDev ? DEV_DEFAULTS.password : undefined);
  return username && password ? { username: normalizeUsername(username), password } : null;
}

export const ownerUsername = () => ownerAccount()?.username ?? null;
export const isOwnerUsername = (username: string) => ownerUsername() === normalizeUsername(username);

export async function checkCredentials(rawUsername: string, password: string): Promise<AccountKind | null> {
  const username = normalizeUsername(rawUsername);
  const owner = ownerAccount();
  if (owner && safeEqual(username, owner.username) && safeEqual(password, owner.password)) return "owner";
  const user = await store.findAdminUser(username);
  if (user && (await verifyPassword(password, user.passwordHash))) return "user";
  return null;
}

export async function createSession(username: string, kind: AccountKind) {
  const token = await new SignJWT({ sub: normalizeUsername(username), kind })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getSession() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const session: Session = { username: String(payload.sub), kind: payload.kind === "user" ? "user" : "owner" };
    if (session.kind === "owner" ? !isOwnerUsername(session.username) : !(await store.findAdminUser(session.username))) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
