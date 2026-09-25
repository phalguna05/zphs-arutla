import { Corners } from "./Corners";

export function DateBadge({ day, month, large = false }: { day: string; month: string; large?: boolean }) {
  return (
    <div className={`date-badge ${large ? "date-badge-lg blueprint" : ""}`}>
      {large && <Corners />}
      <span className="date-badge-day">{day}</span>
      <span className="date-badge-month">{month}</span>
    </div>
  );
}
