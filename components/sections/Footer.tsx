import { site } from "@/lib/site";

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
    </footer>
  );
}
