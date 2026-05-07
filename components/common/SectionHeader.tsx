type Props = {
  lap: number;
  sector: number;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ lap, sector, title, subtitle }: Props) {
  const lapStr = lap.toString().padStart(2, "0");
  return (
    <header className="mb-10">
      <p className="telemetry-accent">
        LAP {lapStr} / SECTOR {sector}
      </p>
      <h2 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight">
        {title}
      </h2>
      <div className="mt-3 h-[2px] w-16 bg-accent" />
      {subtitle && (
        <p className="mt-4 max-w-2xl text-muted">{subtitle}</p>
      )}
    </header>
  );
}
