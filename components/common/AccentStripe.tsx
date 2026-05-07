export function AccentStripe({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`h-[2px] w-full bg-gradient-to-r from-accent via-accent/40 to-transparent ${className}`}
    />
  );
}
