"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TickerItem = { id: number; title: string; dateLabel: string };

type TickerProps = { items: TickerItem[]; label: string; linkLabel: string; emptyText: string };

export function NoticeTicker({ items, label, linkLabel, emptyText }: TickerProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
    return () => clearInterval(timer);
  }, [items.length]);

  const current = items[index];
  return (
    <div className="ticker">
      <div className="container ticker-inner">
        <span className="tag tag-outline">{label}</span>
        <span className="ticker-text" aria-live="polite">
          {current ? (
            <>
              <strong>{current.title}</strong> <span className="text-soft">· {current.dateLabel}</span>
            </>
          ) : (
            emptyText
          )}
        </span>
        <Link href="/notices" className="ticker-link">{linkLabel}</Link>
      </div>
    </div>
  );
}
