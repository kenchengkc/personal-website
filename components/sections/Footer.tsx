import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="v2-footer">
      <div className="v2-footer-inner">
        <div className="v2-footer-brand">
          <span className="v2-brand-mark" aria-hidden>
            KC
          </span>
          <span>
            <span className="v2-brand-name">{site.name}</span>
            <span className="v2-footer-brand-rest">
              {" "}
              · {new Date().getFullYear()}
            </span>
          </span>
        </div>
        <span className="v2-mono v2-mono--dim">Built in New York · F1 fan</span>
      </div>
    </footer>
  );
}
