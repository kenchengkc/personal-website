import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogFrontmatter = {
  title: string;
  date: string;
  summary: string;
  tags?: string[];
};

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
};

function isSafeSlug(slug: string) {
  return /^[a-z0-9][a-z0-9-]*$/i.test(slug);
}

function normalizeFrontmatter(
  data: Partial<BlogFrontmatter>,
  slug: string,
): BlogFrontmatter {
  return {
    title: data.title ?? slug.replaceAll("-", " "),
    date: data.date ?? "1970-01-01",
    summary: data.summary ?? "No summary provided yet.",
    tags: data.tags ?? [],
  };
}

export function getPostSlugs(): string[] {
  const blogDir = path.join(process.cwd(), "content/blog");
  if (!fs.existsSync(blogDir)) return [];

  return fs
    .readdirSync(blogDir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((file) => file.replace(/\.mdx?$/, ""))
    .filter(isSafeSlug);
}

export function getAllPosts(): BlogPostMeta[] {
  const blogDir = path.join(process.cwd(), "content/blog");
  if (!fs.existsSync(blogDir)) return [];

  const posts = getPostSlugs().map((slug) => {
    const mdxPath = path.join(process.cwd(), "content/blog", `${slug}.mdx`);
    const mdPath = path.join(process.cwd(), "content/blog", `${slug}.md`);
    const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath;
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    return {
      slug,
      ...normalizeFrontmatter(data as Partial<BlogFrontmatter>, slug),
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostSource(
  slug: string,
): { content: string; data: BlogFrontmatter } | null {
  if (!isSafeSlug(slug)) return null;

  const candidates = [
    path.join(process.cwd(), "content/blog", `${slug}.mdx`),
    path.join(process.cwd(), "content/blog", `${slug}.md`),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      const { data, content } = matter(raw);
      return {
        content,
        data: normalizeFrontmatter(data as Partial<BlogFrontmatter>, slug),
      };
    }
  }
  return null;
}

export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
