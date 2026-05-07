type Props = {
  label?: string;
  aspect?: "16/9" | "4/3" | "1/1";
};

export function ImagePlaceholder({ label = "IMAGE PENDING", aspect = "16/9" }: Props) {
  const aspectClass =
    aspect === "16/9" ? "aspect-video" : aspect === "4/3" ? "aspect-[4/3]" : "aspect-square";
  return (
    <div
      className={`relative ${aspectClass} w-full overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg)]`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 12px, rgba(220,0,0,0.06) 12px 13px)",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="telemetry-accent">{label}</span>
      </div>
      <div className="absolute top-2 left-2 telemetry">CAM 01</div>
      <div className="absolute top-2 right-2 telemetry">REC ●</div>
    </div>
  );
}
