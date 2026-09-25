import type { Metadata } from "next";
import { EventsCalendar } from "@/components/EventsCalendar";
import { NoticeBoard } from "@/components/NoticeBoard";
import { PageIntro } from "@/components/PageIntro";
import { content, fill } from "@/lib/content";
import { getNotices } from "@/lib/data";

export const metadata: Metadata = { title: "Notice Board" };
export const dynamic = "force-dynamic";

export default async function NoticesPage() {
  const { notices: copy } = content;
  const notices = await getNotices();

  return (
    <>
      <PageIntro kicker={fill(copy.kicker, { count: notices.length })} title={copy.title} />
      <section className="container notices-layout">
        <NoticeBoard
          notices={notices.map(({ createdAt, date, ...n }) => n)}
          copy={copy}
        />
        <aside className="stack-28">
          <EventsCalendar />
          <div className="stack-10">
            <span className="kicker">{copy.academicCalendar.title}</span>
            {copy.academicCalendar.links.map((link) => (
              <a key={link.label} href={link.href} className="small-15">{link.label}</a>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}
