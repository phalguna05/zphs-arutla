"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { content } from "@/lib/content";

export function SiteNav() {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return (
    <nav className="site-nav" aria-label="Main">
      {content.nav.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className="site-nav-link"
          aria-current={isActive(item.href) ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
