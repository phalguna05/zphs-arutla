# PM SHRI ZPHS Arutla — website

Next.js (App Router) + PostgreSQL (Drizzle ORM). Built from the Claude Design project "School Website".

## Where things live

| What | Where |
| --- | --- |
| All page text (headings, facts, staff, results, links, contact info, calendar…) | `content/site.json` |
| Mock programs, notices, messages and visitor history | `content/mock-data.json` |
| Photos (logo, hero, headmaster, gallery) | `public/images/`, referenced from `site.json` |
| Programs, notices, contact messages, visitor counts | PostgreSQL (managed from `/admin`) |
| Database schema | `src/db/schema.ts` (migrations in `drizzle/`) |

### Editing text
Edit `content/site.json` and redeploy. Every string on the site comes from there.
Two strings use a `{count}` placeholder (`programs.kicker`, `notices.kicker`).

### Adding photos
Put the file in `public/images/` and set its path in `site.json`, e.g.
`"home.hero.image.src": "/images/school-building.jpg"`. Empty `src` shows a placeholder frame.
Gallery items work the same way (`home.gallery.items[].src`).

### Programs and notices
Sign in at `/admin/login` with `ADMIN_USERNAME` / `ADMIN_PASSWORD`. From the dashboard you can
publish/remove programs (with up to 3 photos) and notices (with an optional PDF circular),
and read contact-form messages. Photo/PDF uploads use Vercel Blob and are enabled when
`BLOB_READ_WRITE_TOKEN` is set.

## Mock data (no database needed)

If `DATABASE_URL` is not set, the site runs on `content/mock-data.json`, held in memory.
Programs, notices and messages added from `/admin` work but reset when the server restarts,
and the dashboard shows a note saying mock data is in use. Dates in the mock file are given
as `daysAgo`, so notices and messages always look recent.

```bash
npm install
npm run dev        # http://localhost:3000, admin login: admin / arutla@2026
```

`USE_MOCK_DATA=true` forces mock mode even when `DATABASE_URL` is set. The admin defaults
apply only in development; production always needs `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `AUTH_SECRET`.

## Local development with PostgreSQL

```bash
npm install
cp .env.example .env.local     # fill in DATABASE_URL, ADMIN_*, AUTH_SECRET
npm run db:migrate             # create tables
npm run db:seed                # load content/mock-data.json (skips if data exists)
npm run dev
```

## Deploying on Vercel

1. Push this repo to GitHub and import it in Vercel.
2. **Storage → Create → Postgres (Neon)** and connect it to the project. This adds `DATABASE_URL`.
3. *(Optional)* **Storage → Create → Blob** to enable admin photo/PDF uploads (adds `BLOB_READ_WRITE_TOKEN`).
4. **Settings → Environment Variables**: add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET`
   (generate with `openssl rand -base64 32`).
5. Deploy. The `vercel-build` script applies migrations before building. Without a database it
   skips them and the site runs on mock data, so you can deploy first and connect Postgres later
   (redeploy after adding `DATABASE_URL`).
6. Seed once from your machine: `vercel env pull .env.local && npm run db:seed`.

## Changing the database schema

Edit `src/db/schema.ts`, then `npm run db:generate` to create a migration and commit it.
It is applied on the next deploy (or run `npm run db:migrate` locally).

## Scripts

| Script | Purpose |
| --- | --- |
| `dev` / `build` / `start` | Next.js |
| `typecheck` | TypeScript check |
| `db:generate` | Create a migration from schema changes |
| `db:migrate` | Apply migrations |
| `db:seed` | Load `content/mock-data.json` into Postgres (`-- --force` replaces existing data) |
| `db:studio` | Browse the database |
