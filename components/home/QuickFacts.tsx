const facts = [
  {
    label: "SCHOLARSHIP",
    value: "Egleston Scholar",
    detail: "Columbia · Top 1% of Class",
  },
  {
    label: "PUBLICATION",
    value: "IEEE ITSC 2023",
    detail: "Single-author · Session Chair",
  },
  {
    label: "OLYMPIAD",
    value: "USACO Platinum",
    detail: "Perfect Score · Top 1%",
  },
  {
    label: "DATA SCALE",
    value: "1B+ records",
    detail: "Quantiv options pipeline",
  },
];

export function QuickFacts() {
  return (
    <section className="mt-24">
      <p className="telemetry">SECTOR TIMES — CAREER HIGHLIGHTS</p>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {facts.map((f) => (
          <div
            key={f.label}
            className="card-base p-5 flex flex-col gap-2"
          >
            <span className="telemetry-accent">{f.label}</span>
            <span className="text-2xl font-bold tracking-tight">
              {f.value}
            </span>
            <span className="text-xs text-muted">{f.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
