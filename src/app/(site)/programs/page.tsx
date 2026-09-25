import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";
import { Photo } from "@/components/Photo";
import { content, fill } from "@/lib/content";
import { getPrograms } from "@/lib/data";

export const metadata: Metadata = { title: "Programs" };
export const dynamic = "force-dynamic";

export default async function ProgramsPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { programs: copy } = content;
  const { category } = await searchParams;
  const active = copy.categories.includes(category ?? "") ? category! : copy.allLabel;
  const all = await getPrograms();
  const list = active === copy.allLabel ? all : all.filter((p) => p.category === active);

  return (
    <>
      <PageIntro kicker={fill(copy.kicker, { count: all.length })} title={copy.title} narrow>
        <div className="filters">
          {[copy.allLabel, ...copy.categories].map((c) => (
            <Link
              key={c}
              href={c === copy.allLabel ? "/programs" : `/programs?category=${encodeURIComponent(c)}`}
              className={`btn filter ${c === active ? "filter-active" : ""}`}
              scroll={false}
            >
              {c}
            </Link>
          ))}
        </div>
      </PageIntro>

      {list.length ? (
        <section className="container program-grid">
          {list.map((p) => (
            <article key={p.id} className="stack-16">
              <div className="program-photos">
                <Photo framed src={p.images[0]} alt={p.name} sizes="(max-width: 900px) 66vw, 380px" className="program-photo-main" />
                <Photo src={p.images[1]} alt="Photo" sizes="190px" className="program-photo-side" />
                <Photo src={p.images[2]} alt="Photo" sizes="190px" className="program-photo-side" />
              </div>
              <div className="tag-row align-center">
                <span className="tag tag-accent">{p.category}</span>
                <span className="text-soft small">{p.duration}</span>
              </div>
              <h2 className="display-sm">{p.name}</h2>
              <p className="body-text">{p.description}</p>
              <span className="text-soft small">
                {copy.coordinatorLabel}: {p.coordinator}
              </span>
            </article>
          ))}
        </section>
      ) : (
        <p className="container empty">{copy.emptyText}</p>
      )}
    </>
  );
}
