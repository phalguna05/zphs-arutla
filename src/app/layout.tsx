import type { Metadata } from "next";
import "@fontsource/barlow/400.css";
import "@fontsource/barlow/500.css";
import "@fontsource/barlow/700.css";
import "@fontsource/barlow-condensed/400.css";
import "@fontsource/barlow-condensed/600.css";
import { content } from "@/lib/content";
import "./design-system.css";
import "./site.css";

export const metadata: Metadata = {
  title: { default: content.seo.title, template: `%s · ${content.school.shortName}` },
  description: content.seo.description,
  icons: { icon: content.school.logo },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
