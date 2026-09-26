import Link from "next/link";
import { Corners } from "@/components/Corners";
import { DateBadge } from "@/components/DateBadge";
import { NoticeTicker } from "@/components/NoticeTicker";
import { Photo } from "@/components/Photo";
import { SectionHead } from "@/components/SectionHead";
import { content } from "@/lib/content";
import { getNotices, getPrograms } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { home } = content;
  const [notices, programs] = await Promise.all([getNotices(), getPrograms(home.programs.count)]);
  const ticker = notices.slice(0, 3).map(({ id, title, dateLabel }) => ({ id, title, dateLabel }));

  return (
    <>
      <NoticeTicker items={ticker} label={home.ticker.label} linkLabel={home.ticker.linkLabel} emptyText={home.ticker.emptyText} />

      <section className="container hero">
        <div className="stack-22">
          <span className="kicker">{home.hero.kicker}</span>
          <h1 className="display-xl">{home.hero.title}</h1>
          <p className="lead">{home.hero.text}</p>
          <div className="btn-row">
            <Link href={home.hero.primaryCta.href} className="btn btn-primary btn-lg blueprint">
              {home.hero.primaryCta.label}
              <Corners />
            </Link>
            <Link href={home.hero.secondaryCta.href} className="btn btn-secondary btn-lg">
              {home.hero.secondaryCta.label}
            </Link>
          </div>
        </div>
        <Photo framed src={home.hero.image.src} alt={home.hero.image.alt} sizes="(max-width: 900px) 100vw, 580px" className="ratio-4-3" />
      </section>

      <section className="container section-tight">
        <div className="blueprint facts">
          <Corners />
          {home.facts.map((fact) => (
            <div key={fact.label} className="fact">
              <span className="label-sm">{fact.label}</span>
              <span className="fact-value">{fact.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container section two-col">
        <div className="stack-16">
          <SectionHead kicker={home.about.kicker} />
          <h2 className="display-md">{home.about.title}</h2>
          {home.about.paragraphs.map((p, i) => (
            <p key={i} className="body-text">{p}</p>
          ))}
          <Link href={home.about.link.href} className="link-strong">{home.about.link.label}</Link>
        </div>
        <div className="blueprint hm-card">
          <Corners />
          <div className="stack-12">
            <span className="kicker">{home.headmaster.kicker}</span>
            <p className="quote">{home.headmaster.quote}</p>
            <span className="text-soft small">{home.headmaster.name}</span>
          </div>
        </div>
      </section>

      <section className="container section two-col">
        <div className="stack-16">
          <SectionHead kicker={home.academics.kicker} />
          <table className="table levels">
            <tbody>
              {home.academics.levels.map((level) => (
                <tr key={level.classes}>
                  <td className="levels-name">{level.classes}</td>
                  <td className="levels-desc">{level.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="stack-16">
          <SectionHead kicker={home.facilities.kicker} />
          <div className="grid-cells cols-2">
            {home.facilities.items.map((item) => (
              <div key={item} className="cell">{item}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section stack-24">
        <SectionHead kicker={home.schemes.kicker} />
        <div className="schemes">
          {home.schemes.items.map((scheme) => (
            <div key={scheme.name} className="card blueprint scheme">
              <Corners />
              <span className="scheme-name">{scheme.name}</span>
              <span className="text-soft small">{scheme.description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container section two-col">
        <div className="stack-16">
          <SectionHead kicker={home.notices.kicker} />
          <div>
            {notices.slice(0, home.notices.count).map((notice) => (
              <div key={notice.id} className="home-notice">
                <DateBadge day={notice.day} month={notice.month} />
                <div className="stack-6">
                  <div className="tag-row">
                    <span className="tag tag-neutral">{notice.category}</span>
                    {notice.isNew && <span className="tag tag-accent">New</span>}
                  </div>
                  <span className="home-notice-title">{notice.title}</span>
                </div>
              </div>
            ))}
            {!notices.length && <p className="text-soft small-15 pad-top-8">{home.notices.emptyText}</p>}
          </div>
          <Link href={home.notices.link.href} className="link-strong">{home.notices.link.label}</Link>
        </div>
        <div className="stack-16">
          <SectionHead kicker={home.programs.kicker} />
          <div className="stack-22 pad-top-8">
            {programs.map((program) => (
              <div key={program.id} className="home-program">
                <Photo framed src={program.images[0]} alt={program.name} sizes="126px" className="home-program-photo" />
                <div className="stack-6">
                  <span className="label-accent">{program.category}</span>
                  <span className="home-program-name">{program.name}</span>
                  <span className="text-soft small">{program.description}</span>
                </div>
              </div>
            ))}
            {!programs.length && <p className="text-soft small-15">{home.programs.emptyText}</p>}
          </div>
          <Link href={home.programs.link.href} className="link-strong">{home.programs.link.label}</Link>
        </div>
      </section>

      <section className="container section stack-24">
        <SectionHead kicker={home.achievements.kicker} />
        <div className="stats-3">
          {home.achievements.items.map((item) => (
            <div key={item.text} className="stat">
              <span className="stat-value">{item.value}</span>
              <span className="body-text small-15">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container section section-last stack-24">
        <SectionHead kicker={home.gallery.kicker} />
        <div className="gallery">
          {home.gallery.items.map((item) => (
            <Photo key={item.label} framed src={item.src} alt={item.label} sizes="(max-width: 720px) 50vw, 280px" className="ratio-4-3" />
          ))}
        </div>
      </section>

      <section id="admissions" className="admissions">
        <div className="container admissions-inner">
          <div className="stack-14">
            <span className="kicker">{home.admissions.kicker}</span>
            <h2 className="display-md admissions-title">{home.admissions.title}</h2>
            <p className="lead-16">{home.admissions.text}</p>
            <div className="btn-row pad-top-6">
              <a href={home.admissions.primaryCta.href} className="btn btn-primary btn-lg blueprint">
                {home.admissions.primaryCta.label}
                <Corners />
              </a>
              <Link href={home.admissions.secondaryCta.href} className="btn btn-secondary btn-lg">
                {home.admissions.secondaryCta.label}
              </Link>
            </div>
          </div>
          <div className="admissions-cols">
            <div className="stack-12">
              <span className="label-dark">{home.admissions.stepsTitle}</span>
              {home.admissions.steps.map((step, i) => (
                <div key={step} className="adm-step">
                  <span className="adm-step-n">{String(i + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className="stack-12">
              <span className="label-dark">{home.admissions.documentsTitle}</span>
              {home.admissions.documents.map((doc) => (
                <span key={doc} className="adm-doc">{doc}</span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
