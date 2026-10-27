import Image from "next/image";
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
        <h2 className="section-kicker">Publications</h2>

        <div className="publication-list">
          {publications.map((publication) => (
            <article
              className="publication-row"
              key={publication.href}
            >
              <a
                className="publication-figure"
                href={publication.figure.src}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open original ${publication.figure.label} figure`}
              >
                <Image
                  src={publication.figure.src}
                  alt={publication.figure.alt}
                  width={publication.figure.width}
                  height={publication.figure.height}
                  sizes="(max-width: 680px) calc(100vw - 40px), 310px"
                  unoptimized
                />
                <span>{publication.figure.caption}<ArrowUpRight /></span>
              </a>
              <div className="publication-copy">
                <div className="publication-meta">
                  <span>
                    {publication.venue} · {publication.date}
                    {publication.authorship ? ` · ${publication.authorship}` : ""}
                  </span>
                  <span className="citation-tag">
                    {publication.citations} citation{publication.citations === 1 ? "" : "s"}
                  </span>
                </div>
                <h3>
                  <a href={publication.href} target="_blank" rel="noopener noreferrer">
                    <span>{publication.title}</span><ArrowUpRight className="publication-arrow" />
                  </a>
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
