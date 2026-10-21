"use client";

import type { CSSProperties } from "react";
import { DemoPlayer } from "./DemoPlayer";

const HISTORY = [-4.8, 7.2, 2.6, -8.1, 3.5, -2.2, 6.4, 1.7];
const y = (value: number) => 120 - value * 8;
const STAGES = [
  { label: "Price", detail: "Read the move implied by options" },
  { label: "Compare", detail: "Place it against past earnings" },
  { label: "Estimate", detail: "Inspect the model’s range" },
] as const;

export function QuantivDemo() {
  return (
    <DemoPlayer className="quantiv-demo" label="Quantiv earnings research demonstration" eyebrow="Quantiv / Earnings Research" title="An earnings move, in context." stages={STAGES} note="Illustrative event and chart data">
      {({ stage }) => <div className="qv-workspace" data-stage={stage}>
        <div className="qv-context">
          <div><span className="qv-event-mark" aria-hidden="true">Q</span><div><strong>Earnings reaction</strong><span>Eight prior releases → next event</span></div></div>
          <span className="qv-asof"><i /> Before the announcement</span>
        </div>
        <div className="qv-analysis">
          <div className="qv-chart-panel">
            <div className="qv-chart-legend"><span><i className="qv-key-actual" /> Realized move</span><span><i className="qv-key-implied" /> Option-implied</span><span><i className="qv-key-model" /> Model range</span></div>
            <div className="qv-chart" role="img" aria-label="Illustrative chart: eight past earnings moves range from minus 8.1 to plus 7.2 percent. The next event's option-implied range is plus or minus 6 percent; model quantiles are minus 4.1, plus 0.8, and plus 5.3 percent.">
              <div className="qv-y-labels" aria-hidden="true">{[12, 6, 0, -6, -12].map(value => <span key={value} style={{ top: `${y(value) / 2.4}%` }}>{value > 0 ? "+" : ""}{value}%</span>)}</div>
              <div className="qv-plot">
                <svg viewBox="0 0 760 240" preserveAspectRatio="none" aria-hidden="true">
                  {[12, 6, 0, -6, -12].map(value => <path className={value === 0 ? "qv-zero" : "qv-grid"} d={`M0 ${y(value)} H760`} key={value} />)}
                  <path className="qv-event-divider" d="M520 0V240" />
                  <g className="qv-history-layer">
                    {HISTORY.map((value, i) => <g className="qv-observation" key={i} style={{ "--observation": i } as CSSProperties}>
                      <path className="qv-history-stem" d={`M${30 + i * 62} 120V${y(value)}`} />
                      <path className="qv-history-cap" d={`M${24 + i * 62} ${y(value)}h12`} />
                      <path className="qv-history-dot" d={`M${30 + i * 62} ${y(value)}h.1`} />
                    </g>)}
                  </g>
                  <g className="qv-implied-layer">
                    <rect className="qv-implied-fill" x="550" y={y(6)} width="180" height="96" />
                    <path className="qv-implied-bound" d={`M540 ${y(6)}H740M540 ${y(-6)}H740`} />
                    <path className="qv-implied-bracket" d={`M720 ${y(6)}h10v96h-10`} />
                  </g>
                  <g className="qv-model-layer">
                    <path className="qv-density" d="M640 77.6 C627 78 627 94 600 104 C590 109 592 117 607 126 C622 134 628 146 640 152.8 C652 146 658 134 673 126 C688 117 690 109 680 104 C653 94 653 78 640 77.6Z" />
                    <path className="qv-quantile-range" d={`M640 ${y(5.3)}V${y(-4.1)}`} />
                    <path className="qv-quantile-cap" d={`M630 ${y(5.3)}h20M630 ${y(-4.1)}h20`} />
                    <path className="qv-median-point" d={`M640 ${y(.8)}h.1`} />
                  </g>
                </svg>
                <div className="qv-next-event" aria-hidden="true">Next event</div>
                <div className="qv-x-labels" aria-hidden="true">{["−8", "−6", "−4", "−2", "Next"].map((label, i) => <span key={label} style={{ left: `${[30, 154, 278, 402, 640][i] / 7.6}%` }}>{label}</span>)}</div>
              </div>
            </div>
            <div className="qv-chart-caption"><span>Post-earnings return</span><span>Releases before the event</span></div>
          </div>
          <aside className="qv-range-readout" aria-label="Illustrative earnings ranges">
            <div className="qv-range-row qv-range-market"><span>Option-implied move</span><strong>±6.0<span>%</span></strong><small>At-the-money straddle</small></div>
            <div className="qv-range-row qv-range-history"><span>Previous reactions</span><strong>−8.1 <i>to</i> +7.2<span>%</span></strong><small>Eight earnings releases</small></div>
            <div className="qv-range-row qv-range-model"><span>Model quantiles</span><div className="qv-quantiles"><div><small>P10</small><strong>−4.1%</strong></div><div><small>P50</small><strong>+0.8%</strong></div><div><small>P90</small><strong>+5.3%</strong></div></div><small>A range, with uncertainty</small></div>
          </aside>
        </div>
        <div className="qv-validation-strip"><span className="qv-validation-label">Walk-forward evaluation</span><div aria-hidden="true"><i /><i /><i /><i /><b /><em /></div><span>Train on the past. Test on the next period.</span></div>
      </div>}
    </DemoPlayer>
  );
}
