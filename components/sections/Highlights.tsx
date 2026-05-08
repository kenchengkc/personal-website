const items = [
  { v: "Egleston", l: "Columbia Engineering scholar (top 1%)" },
  { v: "IEEE ITSC", l: "2023 — single-author paper, session chair" },
  { v: "USACO", l: "Platinum, perfect score" },
  { v: "1B+", l: "option records in production pipeline" },
];

export function Highlights() {
  return (
    <section className="v2-section v2-highlights">
      <div className="v2-highlights-grid">
        {items.map((i) => (
          <div key={i.v} className="v2-highlight">
            <div className="v2-highlight-v">{i.v}</div>
            <div className="v2-highlight-l">{i.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
