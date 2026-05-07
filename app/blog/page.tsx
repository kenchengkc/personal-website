import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Tag } from "@/components/common/Tag";
import { formatPostDate, getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog — Ken Cheng",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <SectionHeader
        lap={4}
        sector={1}
        title="Blog"
        subtitle="Notes from the garage: ML systems, quant ideas, projects, and engineering lessons."
      />

      {posts.length === 0 ? (
        <section className="card-base p-8">
          <p className="telemetry-accent">PIT WALL STATUS</p>
          <h3 className="mt-3 text-2xl font-bold">
            Box, box — posts coming soon
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
            Drop an MDX file into content/blog with title, date, summary, and
            tags frontmatter. The index and article route will light up
            automatically.
          </p>
        </section>
      ) : (
        <div className="grid gap-4">
          {posts.map((post, index) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card-base group block p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="telemetry-accent">
                    NOTE {String(index + 1).padStart(2, "0")} ·{" "}
                    {formatPostDate(post.date)}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold transition-colors group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
                    {post.summary}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="mt-1 shrink-0 text-muted transition-colors group-hover:text-accent"
                />
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
