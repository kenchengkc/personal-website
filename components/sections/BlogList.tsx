import { publications } from "@/data/portfolio";

export function BlogList() {
  return (
    <section className="writing-section" id="writing">
      <div className="section-heading section-heading-compact" data-reveal>
        <p className="eyebrow">Publications</p>
        <h2>Published work.</h2>
      </div>

      <div className="publication-list">
        {publications.map((publication) => (
          <a
            className="publication-row"
            href={publication.href}
            key={publication.href}
            target="_blank"
            rel="noopener noreferrer"
            data-reveal
          >
            <div>
              <span>
                {publication.venue} · {publication.date}
              </span>
              <h3>{publication.title}</h3>
            </div>
            <span className="publication-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
