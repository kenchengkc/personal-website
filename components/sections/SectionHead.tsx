type Props = {
  eyebrow: string;
  title: string;
  sub?: string;
};

export function SectionHead({ eyebrow, title, sub }: Props) {
  return (
    <header className="v2-sec-head">
      <p className="v2-mono v2-mono--accent">{eyebrow}</p>
      <h1 className="v2-sec-title">{title}</h1>
      {sub ? <p className="v2-sec-sub">{sub}</p> : null}
    </header>
  );
}
