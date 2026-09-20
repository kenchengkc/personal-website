import { publications } from "@/data/portfolio";

export function BlogList() {
  return (
    <section className="writing-section" id="writing">
      <header className="section-heading" data-reveal>
        <span className="section-number">04</span>
        <h2>Publications</h2>
      </header>

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
