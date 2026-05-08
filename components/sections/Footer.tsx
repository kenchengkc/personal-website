import { site } from "@/lib/site";

const credits = [
  {
    label: "Red Bull RB20",
    author: "Lukas Raich",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/",
  },
  {
    label: "McLaren MP4/2C",
    author: "Michael Barera",
    license: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/",
  },
];

export function Footer() {
  return (
    <footer className="v2-footer">
      <div className="v2-footer-inner">
        <div className="v2-footer-brand">
          <span
            className="v2-brand-mark"
            style={{ borderColor: "var(--color-accent)" }}
          >
            <span
              className="v2-brand-mark-dot"
              style={{ background: "var(--color-accent)" }}
            />
            KC
          </span>
          <span>
            {site.name} · {new Date().getFullYear()}
          </span>
        </div>
        <span className="v2-mono v2-mono--dim">Built in New York · F1 fan</span>
      </div>
      <div className="v2-footer-credits">
        <span className="v2-mono">Photos:</span>
        {credits.map((c, i) => (
          <span key={c.label} className="v2-mono v2-mono--dim">
            {i > 0 && " · "}
            {c.label}{" "}
            <a
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--color-text-dim)" }}
            >
              by {c.author}
            </a>{" "}
            ({c.license})
          </span>
        ))}
      </div>
    </footer>
  );
}
