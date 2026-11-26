"use client";

import Image from "next/image";
import { ArrowUpRight, FileSpreadsheet, NotebookText, Play } from "lucide-react";
import { useState } from "react";
import { AnimatedArtwork } from "./AnimatedArtwork";
import { ArtworkWindow } from "./ArtworkWindow";
import { defaultCutoff, featureCount, referenceCount, replies, replyText, type Reply } from "./cml/probe";
import { SignalDiagram } from "./cml/SignalDiagram";
import { TransferDiagram } from "./cml/TransferDiagram";

const steps = [
  { label: "Score", caption: "The scoring direction links the honest and misleading group averages." },
  { label: "Signals", caption: "Each row is one token. The detector averages each column to score the reply." },
  { label: "Transfer", caption: "Fit a new adapter for Qwen while keeping the Llama-trained classifier fixed." },
] as const;

type Model = "Llama" | "Qwen";
type Frame = { stage: number; at: number; reply?: Reply; cutoff?: number; model?: Model };
type FileName = "probe.ipynb" | "replies.csv";

const timeline: readonly Frame[] = [
  { stage: 0, at: 0, reply: "B" },
  { stage: 0, at: 3200, reply: "B", cutoff: 32 },
  { stage: 0, at: 5600, reply: "A" },
  { stage: 1, at: 8600, reply: "A" },
  { stage: 1, at: 12300, reply: "B" },
  { stage: 2, at: 15900, model: "Llama" },
  { stage: 2, at: 19200, model: "Qwen" },
  { stage: 0, at: 22800, reply: "B" },
];

function ReplyRecords({ trace }: { trace: (reply: Reply) => void }) {
  return <div className="cml-csv">
    <div className="cml-question">
      <span>Customer question</span>
      <strong>Does the warranty cover spills?</strong>
      <p>The two-year warranty covers defects and excludes spills.</p>
    </div>
    <table aria-label="Illustrative warranty replies">
      <thead><tr><th scope="col">ID</th><th scope="col">Reply</th><th scope="col">Label</th></tr></thead>
      <tbody>{(["A", "B"] as const).map(id => <tr key={id}>
        <th scope="row"><button type="button" aria-label={`Trace reply ${id}`} title={`Trace reply ${id} in the notebook`}
          onClick={() => trace(id)}>{id}<ArrowUpRight size={12} aria-hidden="true" /></button></th>
        <td>{replyText(id)}</td><td>{id === "A" ? "Honest" : "Misleading"}</td>
      </tr>)}</tbody>
    </table>
    <div className="cml-csv-status">2 rows × 3 columns</div>
  </div>;
}

function CellCode({ stage, reply, model }: { stage: number; reply: Reply; model: Model }) {
  const replyKey = <span className="cml-literal">&quot;{reply}&quot;</span>;
  if (stage === 0) return <code>h = final_layer[{replyKey}].<b>mean</b>(axis=<i>0</i>){"\n"}score = h @ direction</code>;
  if (stage === 1) return <code>H = final_layer[{replyKey}]{"\n"}sns.<b>heatmap</b>(H, cmap=<span className="cml-literal">&quot;RdBu_r&quot;</span>)</code>;
  return <code>adapter = adapters[<span className="cml-literal">&quot;{model}&quot;</span>]{"\n"}classifier.<b>requires_grad_</b>(<i>{model === "Llama" ? "True" : "False"}</i>)</code>;
}

function Notebook({ stage, frame, pause, selectStep }: {
  stage: number; frame: Frame; pause: () => void; selectStep: (index: number) => void;
}) {
  const [file, setFile] = useState<FileName>("probe.ipynb");
  const [chosenReply, setReply] = useState<Reply | null>(null);
  const [chosenModel, setModel] = useState<Model | null>(null);
  const [chosenCutoff, setCutoff] = useState<number | null>(null);
  const cutoff = chosenCutoff ?? frame.cutoff ?? defaultCutoff;
  const reply = chosenReply ?? frame.reply ?? "B";
  const model = chosenModel ?? frame.model ?? "Llama";
  const inputs = stage === 2 ? `transfer:${model}` : stage === 1 ? `signals:${reply}` : `score:${reply}:${cutoff}`;
  const [execution, setExecution] = useState({ inputs, count: 1 });
  if (inputs !== execution.inputs) setExecution({ inputs, count: execution.count + 1 });

  function run() {
    pause();
    setExecution(current => ({ inputs, count: current.count + 1 }));
  }

  return <div className="cml-notebook" data-file={file} data-choice-motion={chosenReply !== null || chosenModel !== null}
    onKeyDown={event => {
      if (file === "probe.ipynb" && event.key === "Enter" && event.shiftKey) {
        event.preventDefault();
        run();
      }
    }}>
    <div className="cml-documents">
      <Image className="cml-lab-mark" src="/media/research/jupyter-mark.svg" alt="Jupyter" width={15} height={20} loading="lazy" fetchPriority="low" unoptimized />
      <div className="cml-files" role="group" aria-label="Open files">
        {(["probe.ipynb", "replies.csv"] as const).map(name => {
          const Icon = name === "probe.ipynb" ? NotebookText : FileSpreadsheet;
          return <button key={name} type="button" aria-pressed={name === file} onClick={() => { pause(); setFile(name); }}>
            <Icon size={13} aria-hidden="true" />{name}
          </button>;
        })}
      </div>
      <span className="cml-origin">Illustrative data</span>
    </div>
    {file === "replies.csv" ? <ReplyRecords trace={id => { setReply(id); selectStep(0); setFile("probe.ipynb"); }} /> : <>
      <div className="cml-toolbar">
        <button type="button" className="cml-run" aria-label="Run cell" title="Run cell (Shift+Enter)" onClick={run}>
          <Play size={12} fill="currentColor" aria-hidden="true" />Run
        </button>
        {stage === 2
          ? <select aria-label="Transfer model" value={model} onFocus={pause} onChange={event => setModel(event.target.value as Model)}>
              <option>Llama</option><option>Qwen</option>
            </select>
          : <select aria-label="Example reply" value={reply} onFocus={pause} onChange={event => setReply(event.target.value as Reply)}>
              <option value="A">Reply A</option><option value="B">Reply B</option>
            </select>}
        {stage === 0 && <label className="cml-cutoff">Cutoff
          <input type="range" aria-label="Review cutoff" min={5} max={35} value={cutoff}
            onFocus={pause} onChange={event => setCutoff(event.target.valueAsNumber)} />
          <span>{cutoff}</span>
        </label>}
      </div>
      <div className="cml-cell">
        <div className="cml-input">
          <span className="cml-prompt" aria-label="Cell execution count">[{execution.count}]:</span>
          <pre><CellCode stage={stage} reply={reply} model={model} /></pre>
        </div>
        <div className="cml-output">
          <div className="cml-output-title">
            <h3>{["Detector score distribution", "Final-layer activations", "Proposed transfer experiment"][stage]}</h3>
            {stage === 0 && <span>n = {referenceCount}</span>}
            {stage === 1 && <span>{replies[reply].length} × {featureCount}</span>}
          </div>
          {stage === 2 ? <TransferDiagram model={model} /> : <SignalDiagram reply={reply} stage={stage === 1 ? "signals" : "score"} cutoff={cutoff} />}
        </div>
      </div>
    </>}
  </div>;
}

export function ModelArtwork() {
  const [replay, setReplay] = useState(0);
  return <ArtworkWindow name="Creative Machines Lab" title="Deception detector">
    <AnimatedArtwork label="Language-model deception detector notebook" steps={steps} timeline={timeline} onReplay={() => setReplay(value => value + 1)}>
      {(stage, frame, pause, selectStep) => <Notebook key={replay} stage={stage} frame={timeline[frame]} pause={pause} selectStep={selectStep} />}
    </AnimatedArtwork>
  </ArtworkWindow>;
}
