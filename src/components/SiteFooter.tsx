import Link from "next/link";
import { content } from "@/lib/content";
import { FooterVisitors } from "./FooterVisitors";

export function SiteFooter() {
  const { school, footer } = content;
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-about">
          <span className="footer-name">{school.name}</span>
          <span className="footer-soft">
            {footer.address.map((line, i) => (
              <span key={i}>
                {line}
                {i < footer.address.length - 1 && <br />}
              </span>
            ))}
          </span>
          <span className="footer-soft">{footer.officeHours}</span>
        </div>
        <div className="footer-col">
          <span className="footer-title">{footer.quickLinksTitle}</span>
          {footer.quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>{link.label}</Link>
          ))}
        </div>
        <div className="footer-col">
          <span className="footer-title">{footer.usefulLinksTitle}</span>
          {footer.usefulLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
          ))}
        </div>
        <FooterVisitors />
      </div>
      <div className="container footer-bottom">
        <span>{footer.copyright}</span>
        <span>{footer.lastUpdated}</span>
      </div>
    </footer>
  );
}
