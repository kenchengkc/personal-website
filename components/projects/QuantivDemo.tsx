"use client";

import { useId, useState } from "react";
import { DemoPlayer } from "./DemoPlayer";

const STAGES = [
  { label: "Price", detail: "Call + put premiums imply a 6% move. The market price stays on the same axis as the model forecast." },
  { label: "Forecast", detail: "Five model quantiles estimate how often a move exceeds a chosen threshold. The blue diamond remains the market’s 6%." },
  { label: "Validate", detail: "The model is tested on four consecutive 60-day windows. Each follows expanding training by a five-day purge." },
  { label: "Serve", detail: "The model becomes a signed bundle. Signature, digests, and native loading must pass before atomic activation." },
] as const;

const QUANTILES = [{ move: 2, p: .1 }, { move: 3.2, p: .25 }, { move: 4.8, p: .5 }, { move: 6.4, p: .75 }, { move: 8.5, p: .9 }];
const PLOT_LEFT = 112;
const PLOT_RIGHT = 474;
const AXIS_Y = 220;
const x = (move: number) => PLOT_LEFT + move / 12 * (PLOT_RIGHT - PLOT_LEFT);
const y = (probability: number) => AXIS_Y - probability * 96;
const CDF_PATH = QUANTILES.map((point, index) => `${index ? "L" : "M"}${x(point.move)} ${y(point.p)}`).join(" ");
const TEST_WIDTH = (PLOT_RIGHT - PLOT_LEFT) * .17;
const PURGE_WIDTH = TEST_WIDTH * 5 / 60;

// The same piecewise CDF interpolation used by Quantiv, with illustrative inputs.
function probabilityAbove(threshold: number) {
  if (threshold > QUANTILES.at(-1)!.move) return { value: 10, bounded: true };
  const upperIndex = QUANTILES.findIndex(point => point.move >= threshold);
  if (upperIndex <= 0) return { value: 90, bounded: threshold < QUANTILES[0].move };
  const lower = QUANTILES[upperIndex - 1], upper = QUANTILES[upperIndex];
  return { value: 100 * (1 - lower.p - (upper.p - lower.p) * (threshold - lower.move) / (upper.move - lower.move)), bounded: false };
}

export function QuantivDemo() {
  const id = useId().replace(/:/g, "");
  const [threshold, setThreshold] = useState(6);
  const [fold, setFold] = useState(2);
  const [corrupt, setCorrupt] = useState(false);
  const probability = probabilityAbove(threshold);
  const probabilityLabel = `${probability.bounded ? "≤ " : ""}${probability.value.toFixed(probability.bounded ? 0 : 1)}%`;

  return (
    <DemoPlayer className="quantiv-demo" label="Quantiv earnings research demonstration" eyebrow="Quantiv" title="Market price, model forecasts, validation, and serving" stages={STAGES} note="Illustrative values, not live forecasts or trading recommendations" duration={5000}>
      {({ stage }) => {
        // Distances share the drawn model spine and verification route. A manual
        // selection reaches the same destination that automatic playback uses.
        const modelDistance = stage === 3 ? (corrupt ? 588 : 813) : stage === 2 ? 326 + fold * 27 - 126 : stage === 1 ? 38 : 0;
        const modelStop = stage === 3 ? (corrupt ? "digest" : "activation") : stage === 2 ? `fold-${fold + 1}` : stage === 1 ? "forecast" : "price";
        const activated = stage === 3 && !corrupt;
        return (
          <div className="qv-research" data-stage={stage} data-corrupt={corrupt}>
            <div className="qv-identity">
              <span className="qv-wordmark">Quantiv<span>.</span></span>
              <span>Illustrative values</span>
            </div>

            <svg className="qv-continuous-map" viewBox="0 0 520 565" role="img" aria-label={`The market’s call and put premiums imply a fixed 6 percent absolute move. A separate quantile model forecasts the move distribution: P10 is 2 percent, P25 is 3.2, P50 is 4.8, P75 is 6.4, and P90 is 8.5. ${probability.bounded ? "At most" : "An estimated"} ${probability.value.toFixed(1)} percent of moves exceed ${threshold} percent. Four expanding training windows have five-day purges and consecutive 60-day unseen tests. Fold ${fold + 1} is selected. ${corrupt ? "The bundle fails SHA-256 verification; the previous model v1 remains active." : activated ? "The signed bundle passes its signature, SHA-256 digests, and native loading; model v2 is active." : "The model’s bundle must pass signature, digest, and native load checks before activation."}`}>
              <defs>
                <linearGradient id={`${id}-cdf`} x1="0" x2="0" y1="0" y2="1">
                  <stop stopColor="#159df3" stopOpacity=".2" />
                  <stop offset="1" stopColor="#159df3" stopOpacity=".02" />
                </linearGradient>
                <pattern id={`${id}-purge`} width="4" height="4" patternUnits="userSpaceOnUse">
                  <path d="M-1 1L1-1M0 4L4 0M3 5L5 3" stroke="#e5b875" strokeWidth="1" />
                </pattern>
              </defs>

              {/* This spine belongs to the model. Market prices never enter it. */}
              <path className="qv-model-spine" d="M54 108V486H450" />
              <path className="qv-forecast-link" d={`M54 164H78Q93 164 103 180L${x(2)} ${y(.1)}`} />
              <text className="qv-spine-label" x="54" y="88" textAnchor="middle">MODEL</text>

              <g className="qv-market-pricing">
                <text className="qv-landmark" x="112" y="25">Market price</text>
                <text className="qv-premium-label" x="159" y="51">CALL</text>
                <text className="qv-price-number" x="159" y="77">$3.20</text>
                <text className="qv-premium-label" x="351" y="51">PUT</text>
                <text className="qv-price-number" x="351" y="77">$2.80</text>
                <text className="qv-plus" x="293" y="75" textAnchor="middle">+</text>
                <path className="qv-price-route" d="M190 86Q190 101 226 101H293M382 86Q382 101 346 101H293" />
                <path className="qv-flow-pulse qv-price-pulse" d="M190 86Q190 101 226 101H293M382 86Q382 101 346 101H293" pathLength="100" />
                <text className="qv-price-equation" x="474" y="25" textAnchor="end">$6 / $100 = 6%</text>
              </g>

              <g className="qv-forecast-field">
                <path className="qv-gridline" d={`M112 ${y(.5)}H474M112 ${y(.9)}H474`} />
                <path className="qv-cdf-fill" d={`${CDF_PATH}V220H${x(2)}Z`} fill={`url(#${id}-cdf)`} />
                <path className="qv-cdf" d={CDF_PATH} pathLength="100" />
                {QUANTILES.map(point => <g key={point.p} className="qv-quantile">
                  <path className="qv-quantile-drop" d={`M${x(point.move)} ${y(point.p)}V220`} />
                  <circle className="qv-quantile-dot" cx={x(point.move)} cy={y(point.p)} r="3.5" />
                  <text className="qv-quantile-label" x={x(point.move)} y={y(point.p) - 10} textAnchor="middle">P{point.p * 100}</text>
                </g>)}
              </g>

              {/* One axis and one blue market actor survive every stage. */}
              <path className="qv-axis" d="M112 220H474" />
              {[0, 3, 6, 9, 12].map(value => <g key={value}>
                <path className="qv-axis-tick" d={`M${x(value)} 220v5`} />
                <text className="qv-axis-label" x={x(value)} y="244" textAnchor="middle">{value}%</text>
              </g>)}
              <g className="qv-market" data-flow-id="quantiv-market" transform={`translate(${x(6)} 220)`}>
                <path className="qv-priced-range" d={`M${PLOT_LEFT - x(6)} 0H0`} />
                <path className="qv-market-beacon" d="M0-7 7 0 0 7-7 0Z" />
                <text className="qv-market-label" x="0" y="46" textAnchor="middle">Market · 6%</text>
              </g>
              <g className="qv-threshold" data-flow-id="quantiv-threshold" style={{ transform: `translateX(${x(threshold)}px)` }}>
                <path d="M0 111V213" />
                {!probability.bounded && <circle cy={y(1 - probability.value / 100)} r="5.5" />}
              </g>
              <text className="qv-axis-title" x="474" y="266" textAnchor="end">Absolute move</text>

              <g className="qv-validation">
                <text className="qv-landmark" x="112" y="294">Walk-forward validation</text>
                <g className="qv-map-legend">
                  <rect className="qv-train" x="112" y="307" width="7" height="7" />
                  <text x="125" y="314">Train</text>
                  <rect x="203" y="307" width="7" height="7" fill={`url(#${id}-purge)`} />
                  <text x="216" y="314">5-day gap</text>
                  <rect className="qv-test" x="350" y="307" width="7" height="7" />
                  <text x="363" y="314">Unseen test</text>
                </g>
                {[0, 1, 2, 3].map(index => {
                  const end = PLOT_LEFT + (PLOT_RIGHT - PLOT_LEFT) * .24 + index * TEST_WIDTH;
                  const row = 326 + index * 27;
                  return <g key={index} className={`qv-fold qv-fold-${index}`} data-active={fold === index}>
                    <path className="qv-fold-link" d={`M54 ${row}H100`} />
                    <text className="qv-fold-number" x="92" y={row - 7} textAnchor="middle">{index + 1}</text>
                    <path className="qv-future" d={`M112 ${row}H474`} />
                    <rect className="qv-train" x="112" y={row - 7} width={end - PLOT_LEFT} height="14" rx="1" />
                    <rect className="qv-purge" x={end} y={row - 10} width={PURGE_WIDTH} height="20" fill={`url(#${id}-purge)`} />
                    <rect className="qv-test" x={end + PURGE_WIDTH} y={row - 7} width={TEST_WIDTH} height="14" rx="1" />
                    <text className="qv-test-label" x={end + PURGE_WIDTH + TEST_WIDTH / 2} y={row + 4} textAnchor="middle">60d</text>
                  </g>;
                })}
                <path className="qv-time-arrow" d="M112 428H474m-5-4 5 4-5 4" />
                <text className="qv-time-label" x="112" y="446">Past</text>
                <text className="qv-time-label" x="474" y="446" textAnchor="end">Future</text>
              </g>

              <g className="qv-verification">
                <text className="qv-landmark" x="112" y="472">Bundle verification</text>
                <path className="qv-check-route" d="M80 486H450" />
                {(["Signature", "SHA-256", "Native load"] as const).map((label, index) => <g className={`qv-checkpoint qv-checkpoint-${index}`} key={label} transform={`translate(${170 + index * 112} 486)`}>
                  <circle r="12" />
                  <path className="qv-check" d="m-5 0 3 3 7-7" />
                  {index === 1 && <path className="qv-cross" d="m-4-4 8 8m0-8-8 8" />}
                  <text x="0" y="31" textAnchor="middle">{label}</text>
                </g>)}
                <path className="qv-activation-route" d="M450 486V543" />
                <circle className="qv-serving-dot" cx="450" cy="543" r="5" />
                <text className="qv-current-model" x="410" y="548" textAnchor="end">current → {activated ? "v2" : "v1"}</text>
              </g>

              {/* The same model node travels down the spine and becomes its bundle. */}
              <g className="qv-model" data-flow-id="quantiv-model" data-flow-stop={modelStop} data-form={stage === 3 ? "bundle" : "model"} data-rejected={stage === 3 && corrupt} style={{ offsetDistance: `${modelDistance}px` }}>
                <g className="qv-model-symbol">
                  <path className="qv-model-halo" d="M0-25 25 0 0 25-25 0Z" />
                  <path className="qv-model-layer qv-model-layer-back" d="M-17-9 0-18 17-9V10L0 19-17 10Z" />
                  <path className="qv-model-layer" d="M-17-15 0-24 17-15V4L0 13-17 4Z" />
                  <path className="qv-model-face" d="M-17-15 0-6 17-15M0-6V13" />
                  <path className="qv-model-mark" d="M-8-14-3-17 2-14 8-17" />
                  <path className="qv-model-rejection" d="m-5-12 10 10m0-10-10 10" />
                </g>
                <rect className="qv-model-label-plate" x={stage === 3 ? 27 : -34} y={stage === 3 ? -9 : 25} width={stage === 3 ? 30 : 68} height="18" rx="2" />
                <text className="qv-model-label" x={stage === 3 ? 42 : 0} y={stage === 3 ? 4 : 38} textAnchor="middle">{stage === 3 ? "v2" : "Model"}</text>
              </g>
            </svg>

            <div className="qv-inspection-dock">
              <div className="qv-dock-panel qv-price-note" hidden={stage !== 0}>
                <span>At-the-money call + put</span>
                <strong>$6 / $100 = 6%</strong>
                <small>Before fees and spreads</small>
              </div>
              <div className="qv-dock-panel" hidden={stage !== 1}>
                <div className="qv-forecast-result" aria-live="polite"><strong>{probabilityLabel}</strong><span>{probability.bounded ? "Tail bound" : "Estimated"} above a {threshold}% move</span></div>
                <div className="qv-interaction" role="group" aria-label="Forecast comparison threshold"><span className="qv-threshold-key">Compare</span>{[3, 6, 10].map(value => <button type="button" data-demo-interaction key={value} aria-label={`Compare a ${value}% market move`} aria-pressed={threshold === value} onClick={() => setThreshold(value)}>{value}%</button>)}</div>
              </div>
              <div className="qv-dock-panel" hidden={stage !== 2}>
                <div className="qv-fold-result"><strong>Four unseen tests</strong><span>60 days each · five-day purge</span></div>
                <div className="qv-interaction" role="group" aria-label="Validation fold"><span>Inspect fold</span>{[0, 1, 2, 3].map(value => <button type="button" data-demo-interaction key={value} aria-label={`Inspect fold ${value + 1}`} aria-pressed={fold === value} onClick={() => setFold(value)}>{value + 1}</button>)}</div>
              </div>
              <div className="qv-dock-panel" hidden={stage !== 3}>
                <div className="qv-serve-result" aria-live="polite"><strong>{corrupt ? "Previous model retained" : "New model active"}</strong><span>{corrupt ? "SHA-256 mismatch · activation blocked" : "Signature + digests + load verified"}</span></div>
                <div className="qv-interaction" role="group" aria-label="Model bundle"><button type="button" data-demo-interaction aria-pressed={!corrupt} onClick={() => setCorrupt(false)}>Verified bundle</button><button type="button" data-demo-interaction aria-pressed={corrupt} onClick={() => setCorrupt(true)}>Corrupt bundle</button></div>
              </div>
            </div>
          </div>
        );
      }}
    </DemoPlayer>
  );
}
