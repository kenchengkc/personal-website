import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { mdxComponents } from "@/components/blog/MdxComponents";
import {
  formatPostDate,
  getPostSlugs,
  getPostSource,
} from "@/lib/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostSource(slug);
  if (!post) return { title: "Post Not Found — Ken Cheng" };
  return {
    title: `${post.data.title} — Ken Cheng`,
    description: post.data.summary,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostSource(slug);
  if (!post) notFound();

  return (
    <>
      <Nav />
      <main className="v2-main">
        <article style={{ maxWidth: 720, margin: "0 auto" }}>
          <Link
            href="/blog"
            className="v2-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 28,
            }}
          >
            ← All writing
          </Link>

          <header
            style={{
              borderBottom: "1px solid var(--color-border)",
              paddingBottom: 28,
              marginBottom: 32,
            }}
          >
            <div className="v2-blog-meta">
              {post.data.tags?.[0] && (
                <span className="v2-blog-tag">{post.data.tags[0]}</span>
              )}
              <span className="v2-mono">{formatPostDate(post.data.date)}</span>
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(32px, 4.5vw, 52px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                margin: "16px 0 0",
              }}
            >
              {post.data.title}
            </h1>
            <p
              style={{
                marginTop: 18,
                color: "var(--color-text-dim)",
                fontSize: 17,
                lineHeight: 1.6,
              }}
            >
              {post.data.summary}
            </p>
            {post.data.tags && post.data.tags.length > 0 && (
              <div className="v2-chips" style={{ marginTop: 18 }}>
                {post.data.tags.map((t) => (
                  <span key={t} className="v2-chip">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </header>

          <div className="prose-v2">
            <MDXRemote source={post.content} components={mdxComponents} />
          </div>

          <div
            style={{
              marginTop: 48,
              borderTop: "1px solid var(--color-border)",
              paddingTop: 28,
            }}
          >
            <Link href="/blog" className="v2-btn v2-btn--ghost">
              ← All writing
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
