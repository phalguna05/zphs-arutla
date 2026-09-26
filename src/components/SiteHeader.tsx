import Link from "next/link";
import { content } from "@/lib/content";
import { Corners } from "./Corners";
import { LockIcon } from "./Icons";
import { SiteNav } from "./SiteNav";

export function SiteHeader() {
  const { school, topBar } = content;
  return (
    <>
      <div className="topbar">
        <div className="container topbar-inner">
          <span className="topbar-dept">{topBar.department}</span>
          {topBar.items.map((item) => (
            <span key={item} className="topbar-item">{item}</span>
          ))}
          <Link href="/admin/login" className="topbar-login">
            <LockIcon />
            {topBar.staffLoginLabel}
          </Link>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link href="/" className="brand">
            <div className="blueprint brand-logo">
              <img src={school.logo} alt={school.logoAlt} width={56} height={56} />
              <Corners />
            </div>
            <div className="brand-text">
              <span className="brand-name">{school.name}</span>
              <span className="brand-tagline">{school.tagline}</span>
            </div>
          </Link>
          <SiteNav />
          <img
            src={school.partnerLogo.src}
            alt={school.partnerLogo.alt}
            width={72}
            height={67}
            className="partner-logo"
          />
        </div>
      </header>
    </>
  );
}
