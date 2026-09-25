import { content } from "./content";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(iso: string) {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return { y, m, d };
}

export function formatDate(iso: string) {
  const { y, m, d } = parts(iso);
  return { day: String(d).padStart(2, "0"), month: MONTHS[m - 1].toUpperCase(), full: `${d} ${MONTHS[m - 1]} ${y}` };
}

export function shortDate(iso: string) {
  const { m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]}`;
}

export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: content.school.timezone }).format(new Date());
}

export function daysBetween(fromISO: string, toISO: string) {
  return (Date.parse(toISO) - Date.parse(fromISO)) / 86_400_000;
}

export function formatTimestamp(value: Date) {
  return formatDate(new Intl.DateTimeFormat("en-CA", { timeZone: content.school.timezone }).format(value)).full;
}
