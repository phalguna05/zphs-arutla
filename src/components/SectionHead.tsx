export function SectionHead({ kicker }: { kicker: string }) {
  return (
    <div className="section-head">
      <span className="kicker">{kicker}</span>
      <div className="rule" />
    </div>
  );
}
