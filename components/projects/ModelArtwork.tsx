"use client";

import { useState } from "react";

/*
 * Architecture values are transcribed from the controlled research actor:
 * cml-research-lying/experiments/controlled_actor.py (CausalActor, _CausalBlock)
 * and experiments/run_controlled_actors.py (configuration, non-smoke defaults).
 * Feature shapes come from CausalActor's documented return_features contract.
 * This is a model inspector, not a captured run or a detector performance claim.
 */
const modules = [
  { name: "token_embedding", kind: "Embedding", shape: "→ 256" },
  { name: "blocks.0", kind: "CausalBlock", shape: "256" },
  { name: "blocks.1", kind: "CausalBlock", shape: "256" },
  { name: "blocks.2", kind: "CausalBlock", shape: "256" },
  { name: "blocks.3", kind: "CausalBlock", shape: "256" },
  { name: "final_norm", kind: "LayerNorm", shape: "256" },
  { name: "output", kind: "Linear", shape: "256 → 3" },
];

export function ModelArtwork() {
  const [view, setView] = useState<"modules" | "features">("modules");

  return (
    <div className="model-artifact" role="figure" aria-label="CausalActor model configuration: width 256, four layers, four attention heads">
      <div className="model-artifact-title">
        <span className="model-artifact-file-mark" aria-hidden="true">py</span>
        <span>CausalActor</span>
        <span className="model-artifact-library">PyTorch</span>
      </div>

      <div className="model-artifact-dimensions" aria-label="Model dimensions: width 256, four layers, four attention heads">
        <span><strong>256</strong> width</span>
        <span><strong>4</strong> layers</span>
        <span><strong>4</strong> heads</span>
      </div>

      <div className="model-artifact-workspace">
        <div className="model-artifact-source" aria-label="Model initialization code">
          <div className="model-artifact-panel-title">controlled_actor.py</div>
          <pre><code><span className="model-artifact-code-line"><i>1</i><b>actor</b> = CausalActor(</span><span className="model-artifact-code-line"><i>2</i>{"    "}width=<em>256</em>,</span><span className="model-artifact-code-line"><i>3</i>{"    "}depth=<em>4</em>,</span><span className="model-artifact-code-line"><i>4</i>{"    "}heads=<em>4</em>,</span><span className="model-artifact-code-line"><i>5</i>{"    "}ff=<em>1024</em>,</span><span className="model-artifact-code-line"><i>6</i>)</span></code></pre>
          <div className="model-artifact-attention">
            <span>Attention</span>
            <code>Q · Kᵀ / √64</code>
            <small>Causal mask · Softmax</small>
          </div>
        </div>

        <div className="model-artifact-inspector">
          <div className="model-artifact-tabs" aria-label="Model inspector view">
            <button type="button" aria-pressed={view === "modules"} onClick={() => setView("modules")}>Modules</button>
            <button type="button" aria-pressed={view === "features"} onClick={() => setView("features")}>Feature shapes</button>
          </div>
          {view === "modules" ? (
            <div className="model-artifact-module-list" aria-label="Model modules">
              {modules.map(({ name, kind, shape }) => (
                <div className="model-artifact-module" key={name}>
                  <span className="model-artifact-tree" aria-hidden="true" />
                  <span className="model-artifact-module-name">{name}<small>{kind}</small></span>
                  <span className="model-artifact-shape">{shape}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="model-artifact-features">
              <div><span>Block outputs</span><code>[batch, 4, 256]</code></div>
              <div><span>Attention head outputs</span><code>[batch, 4, 4, 64]</code></div>
              <div><span>Attention probabilities <small>optional</small></span><code>[batch, 4, 4, 10, 10]</code></div>
              <p>Readout-token vectors; attention records all token positions.</p>
            </div>
          )}
        </div>
      </div>

      <div className="model-artifact-footer"><span>Model configuration</span><span>float32 <span aria-hidden="true">·</span> 10 tokens</span></div>
    </div>
  );
}
