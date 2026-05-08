import Link from "next/link";
import { SectionHead } from "./SectionHead";
import { Arrow } from "@/components/icons/Icons";
import type { BlogPostMeta } from "@/lib/blog";
import { formatPostDate } from "@/lib/blog";

type Props = {
  posts: BlogPostMeta[];
};

const fallback = [
  {
    title: "Pricing implied moves at earnings — a practical IV model",
    date: "2026-04-18",
    tag: "Quant",
    read: "12 min",
    href: "#",
  },
  {
    title: "Why graph ConvNets beat plain transformers on traffic data",
    date: "2026-02-02",
    tag: "ML",
    read: "8 min",
    href: "#",
  },
  {
    title: "A zero-downtime atomic directory swap on EC2",
    date: "2026-01-11",
    tag: "Systems",
    read: "6 min",
    href: "#",
  },
];

export function BlogList({ posts }: Props) {
  const rows =
    posts.length > 0
      ? posts.map((p) => ({
          title: p.title,
          date: p.date,
          tag: p.tags?.[0] ?? "Notes",
          read: "—",
          href: `/blog/${p.slug}`,
        }))
      : fallback;

  return (
    <section className="v2-section" id="blog">
      <SectionHead
        eyebrow="Writing"
        title="Notes & write-ups"
        sub="Long-form engineering posts."
      />
      <div className="v2-blog">
        {rows.map((p) => {
          const isInternal = p.href.startsWith("/");
          const Row = (
            <>
              <div>
                <div className="v2-blog-meta">
                  <span className="v2-blog-tag">{p.tag}</span>
                  <span className="v2-mono">
                    {formatDate(p.date)} · {p.read}
                  </span>
                </div>
                <h3 className="v2-blog-title">{p.title}</h3>
              </div>
              <Arrow size={16} />
            </>
          );
          return isInternal ? (
            <Link href={p.href} key={p.title} className="v2-blog-row">
              {Row}
            </Link>
          ) : (
            <a href={p.href} key={p.title} className="v2-blog-row">
              {Row}
            </a>
          );
        })}
      </div>
    </section>
  );
}

function formatDate(iso: string) {
  // accept either ISO yyyy-mm-dd or pre-formatted strings
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return formatPostDate(iso);
  return iso;
}
