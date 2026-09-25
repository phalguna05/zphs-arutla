import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Corners } from "@/components/Corners";
import { PinIcon } from "@/components/Icons";
import { PageIntro } from "@/components/PageIntro";
import { content } from "@/lib/content";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const { contact } = content;
  return (
    <>
      <PageIntro kicker={contact.kicker} title={contact.title} />
      <section className="container contact-layout">
        <div className="blueprint contact-card">
          <Corners />
          <ContactForm />
        </div>
        <div className="stack-24">
          <div className="contact-info">
            {contact.info.map((item) => (
              <div key={item.label} className="stat stat-sm">
                <span className="label-accent">{item.label}</span>
                <span className="small-15">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="blueprint map">
            <Corners />
            {contact.map.embedUrl ? (
              <iframe src={contact.map.embedUrl} title={contact.map.placeholder} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="map-placeholder">
                <PinIcon className="accent-700-stroke" />
                <span>{contact.map.placeholder}</span>
                <a href={contact.map.directionsUrl} target="_blank" rel="noreferrer" className="link-strong">
                  {contact.map.directionsLabel}
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
