"use client";

import { useId, type CSSProperties } from "react";
import { AnimatedArtwork } from "./AnimatedArtwork";

const STEPS = [
  { label: "Prompt", caption: "The facts stay fixed while the actor’s goal changes." },
  { label: "Record", caption: "The same generation yields an answer and decoder-layer activations." },
  { label: "Review", caption: "Separate factual checks support provisional review. Human validation is pending." },
] as const;

// Method animation, not measured activation values or private dataset examples.
// Current collection: README + actor-dataset-2026-10-25 at repository commit 6638d467.
const layers = Array.from({ length: 16 }, (_, index) => index);
const answerTokens = [35, 23, 40, 27, 17, 34, 21, 29];

export function ModelArtwork() {
  const id = useId().replace(/:/g, "");
  return (
    <AnimatedArtwork label="Creative Machines Lab answer and activation collection" steps={STEPS} duration={3700}>
      {stage => <div className="cml-process" data-cml-stage={stage}>
        <svg viewBox="0 0 480 244" role="img" aria-label="Animated collection method: the same actor prompt produces an answer and layer activations; separate factual checks join the record for provisional review, before human validation.">
          <defs>
            <linearGradient id={`${id}-layer`} x1="0" x2="1" y1="1" y2="0"><stop stopColor="#182e42" /><stop offset=".45" stopColor="#57869a" /><stop offset="1" stopColor="#91b9bf" /></linearGradient>
            <linearGradient id={`${id}-signal`}><stop stopColor="#c1d7dc" stopOpacity="0" /><stop offset=".65" stopColor="#e3bb7b" /><stop offset="1" stopColor="#ffdc9d" /></linearGradient>
            <pattern id={`${id}-cells`} width="6" height="5" patternUnits="userSpaceOnUse"><path d="M0 4.5H6M5.5 0V5" stroke="#a9d1d3" strokeWidth=".5" strokeOpacity=".35" /></pattern>
          </defs>
          <text x="20" y="24" className="cml-process-title">Answer + internal state</text>
          <text x="460" y="24" textAnchor="end" className="cml-process-meta">Qwen3 · Llama 3.1</text>
          <path d="M20 38H460" className="cml-process-rule" />

          <g className="cml-prompt">
            <text x="20" y="67" className="cml-process-label">Same scenario</text>
            {["Facts", "Role", "Goal", "Question"].map((word, i) => <g key={word} transform={`translate(20 ${82 + i * 23})`}>
              <path d="M0 0H94V18H0Z" className={i === 2 ? "cml-goal-token" : "cml-prompt-token"} />
              <text x="8" y="12" className="cml-token-label">{word}</text>
              {i === 2 && <path className="cml-goal-cursor" d="M77 5v8" stroke="#efc589" strokeWidth="1.5" />}
            </g>)}
          </g>
          <path d="M114 126H145L171 112" className="cml-route" />
          <path d="M114 126H145L171 112" pathLength="100" className="cml-route-signal cml-prompt-signal" stroke={`url(#${id}-signal)`} />
          <g className="cml-decoder-volume">
            {layers.map(index => <g key={index} className="cml-decoder-layer" style={{ "--layer": index } as CSSProperties} transform={`translate(${164 + index * 4.5} ${105 - index * 2.1})`}>
              <path d="M0 0 43-16 74 12 31 28Z" fill={`url(#${id}-layer)`} />
              <path d="M0 0V49L31 77V28Z" fill="#1c3448" stroke="#5c8395" strokeWidth=".5" />
              <path d="M31 28 74 12V61L31 77Z" fill={`url(#${id}-cells)`} stroke="#7ba2ae" strokeWidth=".55" />
              <path d="M31 28 74 12V61L31 77Z" className="cml-layer-flash" />
            </g>)}
            <path d="M169 185 238 210 313 179" className="cml-volume-floor" />
          </g>
          <text x="235" y="222" textAnchor="middle" className="cml-process-meta">32 / 36 layers × 4,096</text>

          <path d="M298 103H318L333 82H458M298 135H318L333 147" className="cml-route" />
          <path d="M298 103H318L333 82H458" pathLength="100" className="cml-route-signal cml-answer-signal" stroke={`url(#${id}-signal)`} />
          <path d="M298 135H318L333 147" pathLength="100" className="cml-route-signal cml-activation-signal" stroke="#84bcbf" />
          <text x="334" y="66" className="cml-process-label">Generated answer</text>
          <g className="cml-answer-tokens">
            {answerTokens.map((width, index) => <rect key={index} x={334 + (index % 4) * 31} y={92 + Math.floor(index / 4) * 11} width={Math.min(width, 27)} height="5" rx="1" style={{ "--token": index } as CSSProperties} />)}
          </g>
          <text x="334" y="138" className="cml-process-label">Activation record</text>
          <g className="cml-activation-file" transform="translate(334 147)">
            <path d="M0 0H124V35H0Z" fill="#112735" stroke="#466674" strokeWidth=".7" />
            {Array.from({ length: 7 }, (_, row) => <path key={row} d={`M4 ${4 + row * 4}H120`} stroke="#87aeb6" strokeWidth="1" strokeDasharray={row % 2 ? "2 2 5 2 3 2" : "6 2 2 2 4 2"} strokeOpacity=".5" />)}
            <path className="cml-file-scan" d="M0 0V35" stroke="#e8c28d" strokeWidth="1.5" />
          </g>

          <path d="M36 174V199H134M134 199H322L334 207H458" className="cml-check-route" />
          <path d="M36 174V199H134M134 199H322L334 207H458" pathLength="100" className="cml-route-signal cml-review-signal" stroke="#a6bcce" />
          <rect x="20" y="188" width="110" height="22" fill="#162837" />
          <text x="27" y="202" className="cml-process-label">Fresh fact checks</text>
          <g className="cml-review-record">
            <path d="M334 195H458V220H334Z" fill="#233341" stroke="#746e60" strokeWidth=".7" />
            <text x="345" y="211" className="cml-review-label">Provisional review</text>
            <path className="cml-record-link" d="M395 182V195M453 112V195" />
          </g>
        </svg>
      </div>}
    </AnimatedArtwork>
  );
}
