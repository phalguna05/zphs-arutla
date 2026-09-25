import { NextResponse } from "next/server";
import { z } from "zod";
import { getVisitorStats, recordVisit } from "@/lib/data";

export const dynamic = "force-dynamic";

const body = z.object({ sessionId: z.string().min(8).max(64), isNewVisit: z.boolean() });

export async function GET() {
  return NextResponse.json(await getVisitorStats());
}

export async function POST(request: Request) {
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  await recordVisit(parsed.data.sessionId, parsed.data.isNewVisit);
  return NextResponse.json(await getVisitorStats());
}
