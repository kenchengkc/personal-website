"use client";

import { FileJson2 } from "lucide-react";
import { useState } from "react";
import { AnimatedArtwork } from "./AnimatedArtwork";
import { ArtworkWindow } from "./ArtworkWindow";

const steps = [
  { label: "Compare", caption: "A forecast output has a new revision." },
  { label: "Trace", caption: "Trace the output to the configs that read it." },
  { label: "Publish", caption: "Only configs that read this output receive v042." },
] as const;

// Each tick reveals a reference or updates a revision in the same four rows.
const timeline = [
  { stage: 0, at: 0 },
  { stage: 1, at: 2000 },
  { stage: 1, at: 2800 },
  { stage: 1, at: 3400 },
  { stage: 1, at: 4100 },
  { stage: 2, at: 6000 },
  { stage: 2, at: 6600 },
  { stage: 2, at: 7200 },
  { stage: 2, at: 9000 },
] as const;

type Output = "A" | "B";

// Illustrative excerpts. A config keeps the same source in both views.
const configSource = {
  "01": "A", "03": "A", "07": "B", "08": "B", "09": "B", "14": "A",
} as const;
const excerpts: Record<Output, readonly (keyof typeof configSource)[]> = {
  A: ["01", "03", "08", "14"],
  B: ["01", "07", "08", "09"],
};

function SourceDiff({ output }: { output: Output }) {
  return <div className="amazon-source">
    <div className="amazon-source-heading">
      <span><FileJson2 aria-hidden="true" size={15} />config-{output.toLowerCase()}.json</span>
      <small>Sample data</small>
    </div>
    <div className="amazon-source-line">
      <span aria-hidden="true" className="amazon-line-number">2</span>
      <code>{'"source": '}<b>{`"output-${output.toLowerCase()}"`}</b>,</code>
    </div>
    <div className="amazon-source-line amazon-source-edit">
      <span aria-hidden="true" className="amazon-line-number">3</span>
      <code>{'"version": '}<del>{'"v041"'}</del> <span aria-hidden="true">→</span> <ins>{'"v042"'}</ins></code>
    </div>
  </div>;
}

function ConfigurationTrace({ output, frame }: { output: Output; frame: number }) {
  const rows = excerpts[output];
  const linked = rows.filter(id => configSource[id] === output);

  return <table className="amazon-configs" aria-label="Downstream configurations">
    <thead><tr><th scope="col">Configuration</th><th scope="col">Source reference</th><th scope="col">Version</th></tr></thead>
    <tbody>{rows.map((id, index) => {
      const source = "output-" + configSource[id].toLowerCase();
      const matchIndex = linked.indexOf(id);
      const inspected = frame > index;
      const matched = inspected && matchIndex >= 0;
      const published = matchIndex >= 0 && frame >= 5 + matchIndex;
      return <tr key={id} data-linked={matchIndex >= 0} data-matched={matched} data-published={published}>
        <th scope="row">cfg-{id}</th>
        <td className="amazon-reference">
          {inspected
            ? matchIndex === 0
              ? <code className="amazon-match-field"><span>{'"source": '}</span><b>{`"${source}"`}</b></code>
              : <code>{source}</code>
            : <span className="amazon-pending" aria-label="Awaiting trace">—</span>}
        </td>
        <td className="amazon-revision"><span key={String(published)}>{published ? "v042" : "v041"}</span></td>
      </tr>;
    })}</tbody>
  </table>;
}

export function AmazonArtwork() {
  const [output, setOutput] = useState<Output>("A");
  return <ArtworkWindow name="Amazon" title="Configuration review">
    <div className="amazon-artifact">
      <AnimatedArtwork label="Amazon configuration infrastructure" steps={steps} timeline={timeline}
        playground={() => <div className="amazon-output" role="group" aria-label="Research output">
          <span>Output</span>
          {(["A", "B"] as const).map(value => <button key={value} type="button" aria-label={`Output ${value}`}
            aria-pressed={value === output} onClick={() => setOutput(value)}>{value}</button>)}
        </div>}>
        {(stage, frame) => <div className="amazon-review" data-amazon-stage={stage}>
          <SourceDiff output={output} />
          <ConfigurationTrace output={output} frame={frame} />
        </div>}
      </AnimatedArtwork>
    </div>
  </ArtworkWindow>;
}
