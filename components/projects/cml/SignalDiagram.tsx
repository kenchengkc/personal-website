import { useId, type CSSProperties } from "react";
import styles from "./signal-diagram.module.css";

type Vector = readonly [number, number];
type Token = { word: string; state: Vector };
export type Reply = "A" | "B";

// Both the token states and the labeled training examples are invented for this map.
const replies: Record<Reply, readonly Token[]> = {
  A: [
    { word: "It", state: [0.7, 0.8] }, { word: "covers", state: [0.65, 2.05] },
    { word: "defects.", state: [1.85, 2.45] }, { word: "Spills", state: [1.15, 1.3] },
    { word: "are", state: [2.2, 0.7] }, { word: "excluded.", state: [2.45, 1.7] },
  ],
  B: [
    { word: "You", state: [2.65, 4.5] }, { word: "get", state: [3.25, 5.35] },
    { word: "two", state: [4.35, 4.25] }, { word: "years", state: [3.8, 3.5] },
    { word: "of", state: [2.75, 3.85] }, { word: "protection.", state: [4.2, 5.55] },
  ],
};
const honestMean: Vector = [1, 1];
const misleadingMean: Vector = [4, 5];
const cutoff = 20;
const offsets: readonly Vector[] = [
  [0.82, 0.17], [0.53, 0.54], [0.28, -0.59], [0.74, -0.32], [0.15, 0.78], [0.05, 0.26],
];

export function replyText(reply: Reply) {
  return replies[reply].map(token => token.word).join(" ");
}

function replyMean(reply: Reply): Vector {
  const tokens = replies[reply];
  const mean = (i: number) => tokens.reduce((sum, token) => sum + token.state[i], 0) / tokens.length;
  return [mean(0), mean(1)];
}

// Rotation and uniform scale preserve the angle between the learned direction and the decision boundary.
function mapPoint([x, y]: Vector) {
  return { x: 100 + 40 * (0.8 * (x - 1) + 0.6 * (y - 1)), y: 125 + 40 * (0.6 * (x - 1) - 0.8 * (y - 1)) };
}
const direction: Vector = [misleadingMean[0] - honestMean[0], misleadingMean[1] - honestMean[1]];
function project([x, y]: Vector) {
  return x * direction[0] + y * direction[1];
}

// Two points on the line where the dot product equals the validation cutoff.
const boundaryStart = mapPoint([0, cutoff / direction[1]]);
const boundaryEnd = mapPoint([cutoff / direction[0], 0]);
function cutoffX(y: number) {
  return boundaryStart.x + (y - boundaryStart.y) * (boundaryEnd.x - boundaryStart.x) / (boundaryEnd.y - boundaryStart.y);
}

function ReferenceCloud({ mean, kind }: { mean: Vector; kind: "honest" | "misleading" }) {
  const center = mapPoint(mean);
  return <g className={styles[kind]}>
    <ellipse cx={center.x} cy={center.y} rx="41" ry="31" transform={`rotate(-16 ${center.x} ${center.y})`} className={styles.contour} />
    {offsets.flatMap(([dx, dy], i) => [-1, 1].map(sign => {
      const { x, y } = mapPoint([mean[0] + sign * dx, mean[1] + sign * dy]);
      return kind === "honest"
        ? <circle key={`${i}/${sign}`} cx={x} cy={y} r="3.5" />
        : <path key={`${i}/${sign}`} d={`M${x} ${y - 4}l4 4-4 4-4-4z`} />;
    }))}
  </g>;
}

export function SignalDiagram({ reply, stage }: { reply: Reply; stage: "signals" | "score" }) {
  const id = useId();
  const tokens = replies[reply];
  const previous = reply === "A" ? "B" : "A";
  const mean = replyMean(reply);
  const point = mapPoint(mean);
  const previousPoint = mapPoint(replyMean(previous));
  const score = Number(project(mean).toFixed(1));
  const flagged = score >= cutoff;
  const scoring = stage === "score";
  const result = flagged ? "Flag for review" : "Below cutoff";
  const label = scoring
    ? `Detector score map for reply ${reply}. Score ${score}, ${flagged ? "above" : "below"} the validation cutoff of ${cutoff}. ${result}.`
    : `Final-layer signal map for reply ${reply}. Six token states from “${replyText(reply)}” average to a single reply point at (${mean.map(value => value.toFixed(1)).join(", ")}).`;
  // Use a fixed-width typeface for the source sentence so each token begins over its own word.
  const charWidth = 9.4;
  const sentenceX = (400 - replyText(reply).length * charWidth) / 2;
  const top = 5, bottom = 174;
  const cutoffTop = cutoffX(top), cutoffBottom = cutoffX(bottom);
  return <svg className={styles.diagram} viewBox="0 0 400 210" role="img" aria-label={label}>
    <defs>
      <clipPath id={id + "-map"}><rect x="6" y={top} width="388" height={bottom - top} rx="9" /></clipPath>
      <pattern id={id + "-grid"} width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="0.9" fill="#aac2cb" opacity=".24" />
      </pattern>
      <radialGradient id={id + "-focus"}>
        <stop stopColor="#82ddcd" stopOpacity=".16" />
        <stop offset="1" stopColor="#82ddcd" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect x="6" y={top} width="388" height={bottom - top} rx="9" fill="#101e29" stroke="#314650" />
    <g clipPath={`url(#${id}-map)`}>
      <rect width="400" height={bottom} fill={`url(#${id}-grid)`} />
      {!scoring && <ellipse cx={point.x} cy={point.y} rx="82" ry="62" fill={`url(#${id}-focus)`} />}
      {scoring && <g className={styles.landscape}>
        <path d={`M6 ${top}H${cutoffTop}L${cutoffBottom} ${bottom}H6Z`} fill="#82ddcd" fillOpacity=".07" />
        <path d={`M${cutoffTop} ${top}H394V${bottom}H${cutoffBottom}Z`} fill="#ffca86" fillOpacity=".10" />
        <ReferenceCloud mean={honestMean} kind="honest" />
        <ReferenceCloud mean={misleadingMean} kind="misleading" />
        <path className={styles.boundary} d={`M${cutoffTop} ${top}L${cutoffBottom} ${bottom}`} pathLength="1" />
        <text x={cutoffX(26) - 8} y="27" textAnchor="end" className={styles.cutoff}>Cutoff {cutoff}</text>
        <text x="18" y="81" className={styles.honest}>Honest examples</text>
        <text x="381" y="25" textAnchor="end" className={styles.misleading}>Misleading examples</text>
      </g>}
    </g>
    {!scoring && <g className={styles.meanKey}>
      <circle cx="24" cy="23" r="7" /><circle cx="24" cy="23" r="2" fill="currentColor" />
      <text x="39" y="28">Reply average</text>
    </g>}
    {tokens.map(({ word, state }, i) => {
      const token = mapPoint(state);
      const old = mapPoint(replies[previous][i].state);
      const before = tokens.slice(0, i).reduce((length, token) => length + token.word.length + 1, 0);
      const sourceX = sentenceX + (before + word.length / 2) * charWidth;
      const motion = {
        "--word-x": `${sourceX - token.x}px`, "--word-y": `${193 - token.y}px`,
        "--old-x": `${old.x - token.x}px`, "--old-y": `${old.y - token.y}px`,
        "--mean-x": `${point.x - token.x}px`, "--mean-y": `${point.y - token.y}px`, "--delay": `${i * 160}ms`,
      } as CSSProperties;
      return <g key={reply + word} style={motion}>
        {!scoring && <text x={sourceX} y="199" textAnchor="middle" className={styles.word}>{word}</text>}
        <g transform={`translate(${token.x} ${token.y})`}>
          <circle className={scoring ? styles.ghost : styles.token} r={scoring ? 2 : 4.5} />
          {!scoring && <circle r="3.5" className={styles.pool} />}
          {!scoring && (i === 3 || i === 5) &&
            <text className={styles.pointWord} x={i === 5 ? 8 : -8} y={i === 5 ? 5 : -7} textAnchor={i === 5 ? "start" : "end"}>{word}</text>}
        </g>
      </g>;
    })}
    <g transform={`translate(${point.x} ${point.y})`}>
      <g key={reply} className={styles.replyPoint} style={{ "--old-x": `${previousPoint.x - point.x}px`, "--old-y": `${previousPoint.y - point.y}px` } as CSSProperties}>
        <circle className={styles.halo} r="13" /><circle className={styles.ring} r="8" /><circle r="2.8" fill="#f3f8fa" />
      </g>
    </g>
    {scoring && <g className={styles.outcome}>
      <text x="12" y="199">Reply {reply} · {score}</text>
      <text x="388" y="199" textAnchor="end" className={flagged ? styles.misleading : styles.honest}>{result}</text>
    </g>}
  </svg>;
}
