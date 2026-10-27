import Image from "next/image";
import {
  BrainCircuit,
  ChartNoAxesCombined,
  ChartScatter,
  Database,
  Dices,
  GitBranch,
  Grid2X2,
  MessageSquareText,
  Network,
  SquareTerminal,
} from "lucide-react";

export function Columbia() {
  const coursework = [
    { name: "Machine Learning", icon: BrainCircuit },
    { name: "Natural Language Processing", icon: MessageSquareText },
    { name: "Artificial Intelligence", icon: Network },
    { name: "Advanced Programming in C", icon: SquareTerminal },
    { name: "Data Structures and Algorithms", icon: GitBranch },
    { name: "Databases", icon: Database },
    { name: "Probability Theory", icon: Dices },
    { name: "Statistical Inference", icon: ChartScatter },
    { name: "Linear Algebra", icon: Grid2X2 },
    { name: "Linear Regression", icon: ChartNoAxesCombined },
  ];

  return (
    <section
      className="narrative-section columbia-section"
      id="columbia"
      data-scroll-section
      data-scroll-label="COLUMBIA"
    >
      <div className="reading-column">
        <Image src="/images/butler-library.jpg" alt="Butler Library at Columbia University" width={960} height={640} sizes="(max-width: 720px) 90vw, 360px" className="columbia-photo" />
        <div className="columbia-heading">
          <div>
            <h2>Columbia University</h2>
            <p>B.S. Computer Science · Statistics Minor</p>
            <p>GPA 3.8 · Expected May 2028</p>
          </div>
        </div>

        <div className="columbia-honor">
          <div>
            <strong className="columbia-scholar-title">Egleston Scholar</strong>
            <span className="columbia-scholar-rank">Top 1%</span>
          </div>
          <p>
            Columbia Engineering scholar recognition for exceptional academic
            achievement and intellectual promise.
          </p>
        </div>

        <div className="coursework-block">
          <h3 className="coursework-label" id="coursework-heading">Selected coursework</h3>
          <ul className="coursework-list" aria-labelledby="coursework-heading" role="list">
            {coursework.map(({ name, icon: Icon }) => (
              <li key={name}>
                <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
                <span>{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
