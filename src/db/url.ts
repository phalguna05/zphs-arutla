/** Connection string from DATABASE_URL, or POSTGRES_URL (set by some Vercel Postgres integrations). */
export const databaseUrl = (process.env.DATABASE_URL || process.env.POSTGRES_URL || "").trim() || undefined;
