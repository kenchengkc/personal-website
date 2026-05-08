import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft } from "lucide-react";
import { Tag } from "@/components/common/Tag";
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

  if (!post) {
    return {
      title: "Post Not Found - Ken Cheng",
    };
  }

  return {
    title: `${post.data.title} - Ken Cheng`,
    description: post.data.summary,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostSource(slug);

  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/blog"
        className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:text-accent"
      >
        <ArrowLeft size={14} /> Back to blog
      </Link>

      <header className="border-b border-[var(--color-border)] pb-8">
        <p className="telemetry-accent">
          LAP 04 / SECTOR 2 · {formatPostDate(post.data.date)}
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-6xl">
          {post.data.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          {post.data.summary}
        </p>
        {post.data.tags && post.data.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.data.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}
      </header>

      <div className="mt-10">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>

      <div className="mt-12 border-t border-[var(--color-border)] pt-8">
        <Link href="/blog" className="btn">
          <ArrowLeft size={14} /> ALL POSTS
        </Link>
      </div>
    </article>
  );
}
