import { content } from "@/lib/content";
import { shortDate } from "@/lib/dates";
import { Corners } from "./Corners";

type CalendarEvent = { date: string; endDate?: string; title: string; type?: string };

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function eventLabel(e: CalendarEvent) {
  if (!e.endDate) return shortDate(e.date);
  return `${Number(e.date.slice(8, 10))}–${Number(e.endDate.slice(8, 10))}`;
}

export function EventsCalendar() {
  const { calendar } = content.notices;
  const events: CalendarEvent[] = calendar.events;
  const [year, month] = calendar.month.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const kindOf = (day: number) => {
    const iso = `${calendar.month}-${String(day).padStart(2, "0")}`;
    const match = events.find((e) => (e.endDate ? iso >= e.date && iso <= e.endDate : iso === e.date));
    if (!match) return "";
    return match.type === "holiday" ? "cal-holiday" : "cal-event";
  };

  const cells: (number | null)[] = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  return (
    <div className="blueprint calendar">
      <Corners />
      <div className="calendar-head">
        <span className="calendar-title">{calendar.title}</span>
        <span className="label-accent">{calendar.label}</span>
      </div>
      <div className="calendar-grid">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="cal-weekday">{d}</span>
        ))}
        {cells.map((day, i) => (
          <span key={i} className={`cal-day ${day ? kindOf(day) : ""}`}>{day ?? ""}</span>
        ))}
      </div>
      <div className="calendar-events">
        {events.map((e) => (
          <div key={e.date + e.title} className="cal-row">
            <span className="cal-row-label">{eventLabel(e)}</span>
            <span>{e.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
