"use client";

import { useMemo, useState } from "react";
import { DateBadge } from "./DateBadge";
import { SearchIcon } from "./Icons";

type NoticeItem = {
  id: number;
  title: string;
  body: string;
  category: string;
  pinned: boolean;
  isNew: boolean;
  day: string;
  month: string;
  dateLabel: string;
  attachmentUrl: string | null;
};

type Copy = {
  searchPlaceholder: string;
  allLabel: string;
  categories: string[];
  issuedBy: string;
  downloadLabel: string;
  emptyText: string;
  noneText: string;
};

export function NoticeBoard({ notices, copy }: { notices: NoticeItem[]; copy: Copy }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(copy.allLabel);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notices.filter(
      (n) =>
        (category === copy.allLabel || n.category === category) &&
        (!q || `${n.title} ${n.body}`.toLowerCase().includes(q)),
    );
  }, [notices, query, category, copy.allLabel]);

  return (
    <div className="stack-20">
      <div className="notice-filters">
        <div className="search">
          <SearchIcon className="search-icon" />
          <input
            className="input"
            type="search"
            placeholder={copy.searchPlaceholder}
            aria-label={copy.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="input notice-select" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          {[copy.allLabel, ...copy.categories].map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div className="notice-list">
        {visible.map((n) => (
          <article key={n.id} className="notice">
            <DateBadge day={n.day} month={n.month} large />
            <div className="stack-8">
              <div className="tag-row">
                <span className="tag tag-neutral">{n.category}</span>
                {n.pinned && <span className="tag tag-outline">Pinned</span>}
                {n.isNew && <span className="tag tag-accent">New</span>}
              </div>
              <h3 className="notice-title">{n.title}</h3>
              <p className="body-text small-15">{n.body}</p>
              <div className="notice-meta">
                <span>Issued {n.dateLabel} {copy.issuedBy}</span>
                {n.attachmentUrl && (
                  <a href={n.attachmentUrl} target="_blank" rel="noreferrer">{copy.downloadLabel}</a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
      {!visible.length && <p className="text-soft small-15">{notices.length ? copy.emptyText : copy.noneText}</p>}
    </div>
  );
}
