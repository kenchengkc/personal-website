import { ArrowUpRight } from "@/components/icons/Icons";
import { publications } from "@/data/portfolio";

export function BlogList() {
  return (
    <section
      className="narrative-section writing-section"
      id="writing"
      data-scroll-section
      data-scroll-label="PAPERS"
    >
      <div className="reading-column">
        <p className="section-kicker" data-reveal>Publications</p>

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
                <div className="publication-meta">
                  <span>
                    {publication.venue} · {publication.date}
                    {publication.authorship ? ` · ${publication.authorship}` : ""}
                  </span>
                  <span className="citation-tag">
                    {publication.citations} citation{publication.citations === 1 ? "" : "s"}
                  </span>
                </div>
                <h3>{publication.title}</h3>
              </div>
              <ArrowUpRight className="publication-arrow" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
