type Props = {
  eyebrow: string;
  title: string;
  sub?: string;
};

export function SectionHead({ eyebrow, title, sub }: Props) {
  return (
    <div className="v2-sec-head">
      <div className="v2-sec-eyebrow">
        <span className="v2-sec-eyebrow-bar" />
        <span className="v2-mono v2-mono--accent">{eyebrow}</span>
      </div>
      <h2 className="v2-sec-title">{title}</h2>
      {sub && <p className="v2-sec-sub">{sub}</p>}
    </div>
  );
}
