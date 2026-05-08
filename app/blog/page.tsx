import Link from "next/link";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { SectionHead } from "@/components/sections/SectionHead";
import { Arrow } from "@/components/icons/Icons";
import { formatPostDate, getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Writing - Ken Cheng",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main className="v2-main">
        <section className="v2-section" style={{ marginTop: 0 }}>
          <SectionHead
            eyebrow="Writing"
            title="Notes & write-ups"
            sub="Long-form engineering posts on ML systems, quant ideas, and infra lessons."
          />

          {posts.length === 0 ? (
            <div className="v2-blog">
              <div
                className="v2-blog-row"
                style={{ gridTemplateColumns: "1fr" }}
              >
                <div>
                  <div className="v2-blog-meta">
                    <span className="v2-blog-tag">Heads up</span>
                  </div>
                  <h3 className="v2-blog-title">
                    Posts coming soon. Drop an MDX file into
                    {" "}
                    <code style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                      content/blog/
                    </code>{" "}
                    with title, date, summary, and tags frontmatter.
                  </h3>
                </div>
              </div>
            </div>
          ) : (
            <div className="v2-blog">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="v2-blog-row"
                >
                  <div>
                    <div className="v2-blog-meta">
                      <span className="v2-blog-tag">
                        {post.tags?.[0] ?? "Notes"}
                      </span>
                      <span className="v2-mono">
                        {formatPostDate(post.date)}
                      </span>
                    </div>
                    <h3 className="v2-blog-title">{post.title}</h3>
                    {post.summary && (
                      <p
                        style={{
                          marginTop: 8,
                          fontSize: 13.5,
                          color: "var(--color-text-dim)",
                          lineHeight: 1.55,
                        }}
                      >
                        {post.summary}
                      </p>
                    )}
                  </div>
                  <Arrow size={16} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
