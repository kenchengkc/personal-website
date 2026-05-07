import type { MDXComponents } from "mdx/types";
import { AlertTriangle } from "lucide-react";

function TelemetryHeader({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-8 border-l-2 border-accent pl-4">
      {label && <p className="telemetry-accent mb-2">{label}</p>}
      <div className="text-xl font-bold text-white">{children}</div>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-6 border border-[var(--color-border)] bg-surface p-4">
      <div className="flex gap-3">
        <AlertTriangle size={16} className="mt-1 shrink-0 text-accent" />
        <div className="text-sm leading-relaxed text-white/80">{children}</div>
      </div>
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-12 text-4xl font-extrabold tracking-tight md:text-5xl"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-12 border-b border-[var(--color-border)] pb-3 text-2xl font-bold tracking-tight md:text-3xl"
      {...props}
    />
  ),
  h3: (props) => <h3 className="mt-8 text-xl font-bold" {...props} />,
  p: (props) => (
    <p className="mt-5 leading-8 text-white/80" {...props} />
  ),
  a: (props) => (
    <a
      className="text-accent underline decoration-accent/50 underline-offset-4 transition-colors hover:text-white"
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
      {...props}
    />
  ),
  ul: (props) => <ul className="mt-5 space-y-3" {...props} />,
  ol: (props) => <ol className="mt-5 list-decimal space-y-3 pl-6" {...props} />,
  li: (props) => (
    <li
      className="pl-1 text-sm leading-7 text-white/80 marker:text-accent"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-accent pl-5 text-white/90"
      {...props}
    />
  ),
  hr: () => <div className="my-10 h-px bg-[var(--color-border)]" />,
  code: (props) => (
    <code
      className="border border-[var(--color-border)] bg-black/40 px-1.5 py-0.5 font-mono text-[0.85em] text-white"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto border border-[var(--color-border)] bg-black/60 p-4 text-sm leading-7"
      {...props}
    />
  ),
  TelemetryHeader,
  Callout,
};
