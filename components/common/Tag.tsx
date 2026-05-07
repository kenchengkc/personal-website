export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-muted border border-[var(--color-border)] bg-bg/40 rounded-sm">
      {children}
    </span>
  );
}
