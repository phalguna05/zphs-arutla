"use client";

import { content } from "@/lib/content";
import { useVisitorStats } from "./useVisitorStats";
import { VisitorDigits } from "./VisitorDigits";

export function FooterVisitors() {
  const stats = useVisitorStats({ track: true });
  const { footer } = content;
  return (
    <div className="footer-col footer-visitors">
      <span className="footer-title">{footer.visitorsTitle}</span>
      <VisitorDigits total={stats?.total} />
      <div className="footer-visitor-meta">
        <span className="online-dot-row">
          <span className="online-dot" />
          {stats?.online ?? "–"} {footer.onlineLabel}
        </span>
        <span>
          {stats?.today ?? "–"} {footer.todayLabel}
        </span>
      </div>
    </div>
  );
}
