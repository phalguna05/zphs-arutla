export function VisitorDigits({ total, className = "" }: { total: number | undefined; className?: string }) {
  const chars = total === undefined ? ["–"] : total.toLocaleString("en-IN").split("");
  return (
    <div className={`digits ${className}`} aria-label={total === undefined ? "Loading" : `${total} visitors`}>
      {chars.map((ch, i) => (
        <span key={i} className={ch === "," ? "digit-sep" : "digit"}>
          {ch}
        </span>
      ))}
    </div>
  );
}
