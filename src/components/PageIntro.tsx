export function PageIntro({ kicker, title, narrow, children }: { kicker: string; title: string; narrow?: boolean; children?: React.ReactNode }) {
  return (
    <section className="container page-intro">
      <span className="kicker">{kicker}</span>
      <h1 className={`display-lg ${narrow ? "narrow" : ""}`}>{title}</h1>
      {children}
    </section>
  );
}
