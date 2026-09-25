"use client";

import { useEffect, useState } from "react";

export type VisitorStats = { total: number; today: number; online: number };

const SESSION_KEY = "visitor_session";
const HEARTBEAT_MS = 30_000;

function sessionId() {
  try {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) return { id: existing, isNew: false };
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
    return { id, isNew: true };
  } catch {
    return { id: crypto.randomUUID(), isNew: true };
  }
}

export function useVisitorStats({ track }: { track: boolean }) {
  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    const session = track ? sessionId() : null;
    let isNewVisit = session?.isNew ?? false;

    const tick = async () => {
      try {
        const res = session
          ? await fetch("/api/visitors", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sessionId: session.id, isNewVisit }),
            })
          : await fetch("/api/visitors", { cache: "no-store" });
        isNewVisit = false;
        if (res.ok && !cancelled) setStats(await res.json());
      } catch {}
    };

    tick();
    const timer = setInterval(tick, HEARTBEAT_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [track]);

  return stats;
}
