"use client";

import Image from "next/image";
import { Check, MessageCircle, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { AnimatedArtwork } from "./AnimatedArtwork";
import { ArtworkWindow } from "./ArtworkWindow";
import { SignalDiagram, replyText, type Reply } from "./cml/SignalDiagram";
import { TransferDiagram } from "./cml/TransferDiagram";

const steps = [
  { label: "Replies", title: "Does it cover spills?", caption: "Two replies to the same sales prompt." },
  { label: "Signals", title: "Token signals", caption: "Six example signals form one reply average." },
  { label: "Score", title: "Detector score", caption: "Illustrative scores use a validation cutoff." },
  { label: "Transfer", title: "Proposed transfer", caption: "Fit a new adapter. Keep the scoring rule fixed." },
] as const;

type Model = "Llama" | "Qwen";
type Frame = { stage: number; at: number; reply?: Reply; model?: Model };

const timeline: readonly Frame[] = [
  { stage: 0, at: 0, reply: "A" },
  { stage: 0, at: 2800, reply: "B" },
  { stage: 1, at: 5700 },
  { stage: 2, at: 10900 },
  { stage: 3, at: 15700, model: "Llama" },
  { stage: 3, at: 18700, model: "Qwen" },
  { stage: 3, at: 21700, model: "Qwen" },
];

function WarrantyExample({ reply }: { reply: Reply }) {
  const phrase = reply === "A" ? "Spills are excluded." : "two years";
  const [before, after] = replyText(reply).split(phrase);
  return <div className="cml-case" data-reply={reply}>
    <div className="cml-case-evidence">
      <Image className="cml-case-photo" src="/media/research/cml-warranty-spill.webp"
        width={704} height={704} unoptimized loading="lazy" fetchPriority="low" alt="Water spills from a glass onto a laptop keyboard." />
      <div className="cml-policy" aria-label="Warranty terms">
        <span className="cml-policy-heading"><ShieldCheck aria-hidden="true" size={16} />Warranty</span>
        <strong className="cml-policy-term">2 years</strong>
        <div className="cml-policy-items">
          <span><Check role="img" aria-label="Covered" size={14} />Defects</span>
          <span className="cml-exclusion"><X role="img" aria-label="Excluded" size={14} />Spills</span>
        </div>
      </div>
    </div>
    <blockquote className="cml-quote" key={reply}>
      <MessageCircle aria-hidden="true" size={17} />
      <span>“{before}<mark>{phrase}</mark>{after}”</span>
    </blockquote>
  </div>;
}

export function ModelArtwork() {
  const [chosenReply, setReply] = useState<Reply | null>(null);
  const [chosenModel, setModel] = useState<Model | null>(null);

  return <ArtworkWindow name="Creative Machines Lab" title="Cross-model lie detector">
    <AnimatedArtwork label="How a language-model deception detector works" steps={steps} timeline={timeline}
      onReplay={() => { setReply(null); setModel(null); }}>
      {(stage, frame, pause) => {
        const reply = chosenReply ?? timeline[frame].reply ?? "B";
        const model = chosenModel ?? timeline[frame].model ?? "Llama";
        return <div className="cml-process" data-cml-stage={stage}
          data-choice-motion={stage === 3 ? chosenModel !== null : chosenReply !== null}>
          <div className="cml-scene-head">
            <h3>{steps[stage].title}</h3>
            <div className="cml-selector" onFocusCapture={pause} onClickCapture={pause}
              role="group" aria-label={stage === 3 ? "Transfer model" : "Example reply"}>
              {stage === 3
                ? (["Llama", "Qwen"] as const).map(name => <button type="button" key={name}
                    aria-pressed={name === model} onClick={() => setModel(name)}>{name}</button>)
                : (["A", "B"] as const).map(name => <button type="button" key={name}
                    aria-pressed={name === reply} onClick={() => setReply(name)}>Reply {name}</button>)}
            </div>
          </div>
          {stage === 0 ? <WarrantyExample reply={reply} />
            : stage === 3 ? <TransferDiagram model={model} />
            : <SignalDiagram reply={reply} stage={stage === 1 ? "signals" : "score"} />}
        </div>;
      }}
    </AnimatedArtwork>
  </ArtworkWindow>;
}
