import type { Metadata } from "next";
import { Corners } from "@/components/Corners";
import { FileDownIcon } from "@/components/Icons";
import { PageIntro } from "@/components/PageIntro";
import { SectionHead } from "@/components/SectionHead";
import { content } from "@/lib/content";
import { getStaff } from "@/lib/data";

export const metadata: Metadata = { title: "About" };
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { about } = content;
  const staff = await getStaff();
  return (
    <>
      <PageIntro kicker={about.kicker} title={about.title} />

      <section className="container section-flush stats-4">
        {about.timeline.map((item) => (
          <div key={item.year} className="stat">
            <span className="stat-value stat-value-md">{item.year}</span>
            <span className="body-text small-15">{item.text}</span>
          </div>
        ))}
      </section>

      <section className="container section-flush equal-2">
        {[about.vision, about.mission].map((block, i) => (
          <div key={block.title} className="card blueprint vm-card">
            <Corners />
            <span className="kicker">{block.title}</span>
            <p className={i === 0 ? "quote quote-24" : "lead-16"}>{block.text}</p>
          </div>
        ))}
      </section>

      <section className="container section-flush stack-24">
        <SectionHead kicker={about.campus.title} />
        <div className="campus">
          <div className="stack-16">
            {about.campus.paragraphs.map((p, i) => (
              <p key={i} className="body-text">{p}</p>
            ))}
          </div>
          <div className="stack-12">
            <span className="label-dark">{about.campus.institutionsTitle}</span>
            {about.campus.institutions.map((item) => (
              <div key={item.name} className="adm-doc institution">
                <span>{item.name}</span>
                {"students" in item && item.students !== undefined && (
                  <span className="institution-count">{item.students.toLocaleString("en-IN")} students</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="stats-4">
          {about.campus.stats.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat-value stat-value-md">{s.value}</span>
              <span className="body-text small-15">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container section-flush about-cols">
        <div className="stack-16">
          <SectionHead kicker={about.faculty.title} />
          <div className="table-scroll">
            <table className="table table-15">
              <thead>
                <tr>{about.faculty.columns.map((c) => <th key={c}>{c}</th>)}</tr>
              </thead>
              <tbody>
                {staff.map((m) => (
                  <tr key={m.id}>
                    <td className="strong">{[m.prefix, m.name].filter(Boolean).join(" ")}</td>
                    <td>{m.designation}</td>
                    <td>{m.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!staff.length && <p className="text-soft small-15 pad-top-8">{about.faculty.emptyText}</p>}
          </div>
        </div>
        <div className="stack-16">
          <SectionHead kicker={about.results.title} />
          <table className="table table-15">
            <thead>
              <tr>{about.results.columns.map((c) => <th key={c}>{c}</th>)}</tr>
            </thead>
            <tbody>
              {about.results.rows.map((r) => (
                <tr key={r.year}>
                  <td className="strong">{r.year}</td>
                  <td>{r.appeared}</td>
                  <td>{r.pass}</td>
                  <td>{r.gpa10}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pad-top-16">
            <SectionHead kicker={about.downloads.title} />
          </div>
          <div className="stack-10">
            {about.downloads.items.map((d) => (
              <a key={d.label} href={d.href} className="download">
                <FileDownIcon />
                <span className="download-label">{d.label}</span>
                <span className="text-soft small-13">{d.meta}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="container section-flush section-last stack-16">
        <SectionHead kicker={about.disclosure.title} />
        <div className="grid-cells cols-4">
          {about.disclosure.items.map((item) => (
            <div key={item.label} className="cell cell-kv">
              <span className="cell-key">{item.label}</span>
              <span className="strong">{item.value}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
