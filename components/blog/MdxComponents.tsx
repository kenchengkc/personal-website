import type { MDXComponents } from "mdx/types";

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <aside
      style={{
        margin: "20px 0",
        padding: "14px 18px",
        border: "1px solid var(--color-border)",
        background: "rgba(31,63,139,0.13)",
        borderLeft: "2px solid var(--color-accent)",
        borderRadius: 10,
        fontSize: 14,
        color: "var(--color-text-dim)",
      }}
    >
      {children}
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  Callout,
};
