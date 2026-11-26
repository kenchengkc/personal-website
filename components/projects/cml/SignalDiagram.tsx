import { useId, type CSSProperties } from "react";
import { decision, histogram, meanActivation, referenceCount, replies, scoreReply, type Reply } from "./probe";
import styles from "./signal-diagram.module.css";

const blue = "#3069ad";
const rust = "#b44c31";
const ink = "#252b31";
const grid = "#d8dce0";

// The same symmetric color limits apply to both replies and to the mean row.
function activationColor(value: number) {
  const white = [248, 248, 245];
  const limit = value < 0 ? [48, 105, 173] : [180, 76, 49];
  const strength = Math.min(1, Math.abs(value) / 6);
  return `rgb(${white.map((start, i) => Math.round(start + (limit[i] - start) * strength)).join(",")})`;
}

function displayValue(value: number) {
  return String(value).replace("-", "−");
}

function Heatmap({ reply }: { reply: Reply }) {
  const id = useId();
  const tokens = replies[reply];
  const mean = meanActivation(reply);
  const left = 98, top = 29, cellWidth = 40, cellHeight = 18;
  const meanY = top + cellHeight * tokens.length + 6;
  const label = `Token activation heatmap for reply ${reply}. Rows are six public-answer tokens and columns are six final-layer units. Mean activations: ${mean.join(", ")}. Colors range from minus six to plus six.`;
  return <svg viewBox="0 0 352 197" className={styles.diagram} role="img" aria-label={label}>
    <defs>
      <linearGradient id={id}>
        <stop stopColor={blue} /><stop offset=".5" stopColor={activationColor(0)} /><stop offset="1" stopColor={rust} />
      </linearGradient>
    </defs>
    <text x={left - 9} y="19" textAnchor="end" className={styles.axisLabel}>Token</text>
    {mean.map((_, j) => <text key={j} x={left + (j + .5) * cellWidth} y="19" textAnchor="middle" className={styles.unit}>U{j + 1}</text>)}
    <g key={reply}>
      {tokens.map(({ word, state }, i) => {
        const y = top + i * cellHeight;
        return <g key={word} className={styles.tokenRow} style={{ "--delay": `${i * 125}ms` } as CSSProperties}>
          <text x={left - 9} y={y + 13.5} textAnchor="end" className={styles.token}>{word}</text>
          {state.map((value, j) => <rect key={j} x={left + j * cellWidth} y={y} width={cellWidth - 1} height={cellHeight - 1}
            fill={activationColor(value)}><title>{`${word}, unit ${j + 1}: ${value}`}</title></rect>)}
        </g>;
      })}
      <g className={styles.meanRow}>
        <text x={left - 9} y={meanY + 13.5} textAnchor="end" className={styles.meanLabel}>Mean</text>
        {mean.map((value, j) => <g key={j}>
          <rect x={left + j * cellWidth} y={meanY} width={cellWidth - 1} height={cellHeight} fill={activationColor(value)} />
          <text x={left + (j + .5) * cellWidth} y={meanY + 13.3} textAnchor="middle" className={styles.value}
            fill={Math.abs(value) >= 5.5 ? "#fff" : "#151b20"}>{displayValue(value)}</text>
        </g>)}
      </g>
    </g>
    <text x={left - 9} y="183" textAnchor="end" className={styles.axisLabel}>Activation</text>
    <rect x={left} y="174" width="130" height="8" fill={`url(#${id})`} />
    {["−6", "0", "+6"].map((tick, i) => <text key={tick} x={left + i * 65} y="196" textAnchor="middle" className={styles.tick}>{tick}</text>)}
  </svg>;
}

const plot = { left: 38, right: 339, top: 39, bottom: 127 };
const maxScore = histogram[histogram.length - 1].end;
const maxCount = Math.ceil(Math.max(...histogram.map(bin => Math.max(bin.honest, bin.misleading))) / 2) * 2;
const scoreX = (score: number) => plot.left + (plot.right - plot.left) * score / maxScore;
const countY = (count: number) => plot.bottom - (plot.bottom - plot.top) * count / maxCount;

function Histogram({ reply, cutoff }: { reply: Reply; cutoff: number }) {
  const score = scoreReply(reply);
  const result = decision(score, cutoff);
  const relation = score < cutoff ? "below" : score > cutoff ? "above" : "at";
  const label = `Probe score histogram for reply ${reply}. Score ${score}, ${relation} the cutoff of ${cutoff}. ${result}. Counts of ${referenceCount} illustrative reference replies in four-point score bins, grouped by honest and misleading labels.`;
  return <svg viewBox="0 0 352 192" className={styles.diagram} role="img" aria-label={label}>
    <g className={styles.legend}>
      <rect x="37" y="6" width="13" height="9" fill={blue} fillOpacity=".36" stroke={blue} />
      <text x="56" y="15">Honest</text>
      <rect x="115" y="6" width="13" height="9" fill={rust} fillOpacity=".36" stroke={rust} />
      <text x="134" y="15">Misleading</text>
      <path d="M232 11h19" stroke={ink} strokeWidth="1.8" strokeDasharray="4 3" />
      <text x="257" y="15">Cutoff {cutoff}</text>
    </g>
    {Array.from({ length: maxCount / 2 + 1 }, (_, i) => i * 2).map(count => <g key={count}>
      <line x1={plot.left} x2={plot.right} y1={countY(count)} y2={countY(count)} stroke={grid} strokeWidth=".8" />
      <text x={plot.left - 7} y={countY(count) + 4} textAnchor="end" className={styles.tick}>{count}</text>
    </g>)}
    <text transform="translate(12 85) rotate(-90)" textAnchor="middle" className={styles.axisLabel}>Count</text>
    <g className={styles.bars}>
      {(["honest", "misleading"] as const).map(group => histogram.map(bin => {
        const count = bin[group];
        if (!count) return null;
        const color = group === "honest" ? blue : rust;
        return <rect key={group + bin.start} x={scoreX(bin.start)} y={countY(count)}
          width={scoreX(bin.end) - scoreX(bin.start)} height={plot.bottom - countY(count)} fill={color} fillOpacity=".34" stroke={color} strokeWidth="1.1">
          <title>{`${group}, scores ${bin.start} to ${bin.end}: ${count} replies`}</title>
        </rect>;
      }))}
    </g>
    <g className={styles.indicator} style={{ transform: `translateX(${scoreX(cutoff)}px)` }}>
      <path d={`M0 ${plot.top - 5}V${plot.bottom}`} stroke={ink} strokeWidth="1.8" strokeDasharray="4 3" />
    </g>
    <g className={styles.indicator} style={{ transform: `translateX(${scoreX(score)}px)` }}>
      <g key={reply} className={styles.marker}>
        <path d={`M0 ${plot.top - 3}V${plot.bottom}`} stroke={ink} strokeWidth="2.2" />
        <path d={`M-4.8 ${plot.top - 9}h9.6L0 ${plot.top - 1}z`} fill={ink} />
      </g>
    </g>
    <line x1={plot.left} x2={plot.right} y1={plot.bottom} y2={plot.bottom} stroke="#555f66" />
    {[0, 10, 20, 30, 40].map(tick => <g key={tick}>
      <line x1={scoreX(tick)} x2={scoreX(tick)} y1={plot.bottom} y2={plot.bottom + 3} stroke="#555f66" />
      <text x={scoreX(tick)} y={plot.bottom + 15} textAnchor="middle" className={styles.tick}>{tick}</text>
    </g>)}
    <text x={(plot.left + plot.right) / 2} y="159" textAnchor="middle" className={styles.axisLabel}>Probe score</text>
    <g className={styles.result} key={reply + result}>
      <path d="m13 174 4.5 7 4.5-7z" fill={ink} />
      <text x="29" y="184">Reply {reply} · {score}</text>
      <text x={plot.right} y="184" textAnchor="end" fill={score >= cutoff ? rust : blue}>{result}</text>
    </g>
  </svg>;
}

export function SignalDiagram({ reply, stage, cutoff }: { reply: Reply; stage: "signals" | "score"; cutoff: number }) {
  return stage === "signals" ? <Heatmap reply={reply} /> : <Histogram reply={reply} cutoff={cutoff} />;
}
