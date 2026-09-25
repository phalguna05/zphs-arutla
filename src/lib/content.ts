import site from "@content/site.json";

export type SiteContent = typeof site;

export const content: SiteContent = site;

export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}
