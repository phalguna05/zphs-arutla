"use client";

import { useVisitorStats } from "../useVisitorStats";
import { VisitorDigits } from "../VisitorDigits";

export function AdminOnline() {
  const stats = useVisitorStats({ track: false });
  return (
    <span className="online-dot-row small-14">
      <span className="online-dot" />
      {stats?.online ?? "–"} visitors online
    </span>
  );
}

export function AdminVisitorStats({ initial }: { initial: { total: number; today: number } }) {
  const stats = useVisitorStats({ track: false }) ?? initial;
  return (
    <>
      <div className="admin-stat admin-stat-wide">
        <span className="label-sm">Total visitors · live</span>
        <VisitorDigits total={stats.total} className="digits-admin" />
      </div>
      <div className="admin-stat">
        <span className="label-sm">Visitors today</span>
        <span className="admin-stat-value">{stats.today}</span>
      </div>
    </>
  );
}
