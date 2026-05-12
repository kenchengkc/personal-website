import { SectionHead } from "./SectionHead";
import { Arrow } from "@/components/icons/Icons";
import { site } from "@/lib/site";

type Publication = {
  title: string;
  venue: string;
  tag: string;
  date: string;
  citations: number;
  href: string;
};

const publications: Publication[] = [
  {
    title:
      "A Need For Speed: Enhancing F1 Race Cars with a Novel Computational Fluid Dynamics and Machine Learning Method",
    venue: "Highlights in Science Engineering and Technology",
    tag: "Highlights in Science Engineering and Technology",
    date: "May 2023",
    citations: 2,
    href: site.links.f1cfd,
  },
  {
    title:
      "GC-INF: A Novel Adaptive Traffic Control System using Machine Learning for Turning Ratio Predictions",
    venue:
      "IEEE Intelligent Transportation Systems Conference Proceedings 2023",
    tag: "IEEE Intelligent Transportation Systems Conference Proceedings 2023",
    date: "September 2023",
    citations: 1,
    href: site.links.gcinf,
  },
];

export function BlogList() {
  return (
    <section className="v2-section" id="blog">
      <SectionHead
        eyebrow="Publications"
        title="Papers and writing"
        sub="Peer-reviewed and competition-published research."
      />
      <div className="v2-blog">
        {publications.map((p) => (
          <a
            key={p.href}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="v2-blog-row"
          >
            <div>
              <div className="v2-blog-meta">
                <span className="v2-blog-tag" aria-label={p.venue}>
                  {p.tag}
                </span>
                <span className="v2-mono">{p.date}</span>
                <span
                  className="v2-citations"
                  aria-label={`${p.citations} citations`}
                >
                  <strong>{p.citations}</strong>
                  <span>{p.citations === 1 ? "citation" : "citations"}</span>
                </span>
              </div>
              <h3 className="v2-blog-title">{p.title}</h3>
            </div>
            <Arrow size={16} />
          </a>
        ))}
      </div>
    </section>
  );
}
