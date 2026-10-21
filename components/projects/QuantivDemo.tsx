"use client";

import { Mulish, JetBrains_Mono } from "next/font/google";
import { useId, useState, useSyncExternalStore } from "react";
import { DemoPlayer } from "./DemoPlayer";

const mulish = Mulish({ subsets: ["latin"], display: "swap", variable: "--qv-font" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], display: "swap", variable: "--qv-mono" });
const STAGES = [
  { label: "Price", detail: "The call and put premiums price a move in either direction." },
  { label: "Forecast", detail: "Five quantile forecasts estimate how often the move could exceed the market’s price." },
  { label: "Validate", detail: "Each 60-day test window follows training by a five-day purge." },
  { label: "Serve", detail: "Only verified bundles replace the active model. A corrupt update leaves it serving." },
] as const;
const QUANTILES = [{ move: 2, p: .1 }, { move: 3.2, p: .25 }, { move: 4.8, p: .5 }, { move: 6.4, p: .75 }, { move: 8.5, p: .9 }];

function subscribeSize(callback: () => void) {
  const query = window.matchMedia("(max-width: 620px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

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
  const compact = useSyncExternalStore(subscribeSize, () => window.matchMedia("(max-width: 620px)").matches, () => false);
  const [threshold, setThreshold] = useState(6);
  const [fold, setFold] = useState(2);
  const [corrupt, setCorrupt] = useState(false);
  const width = compact ? 360 : 760;
  const left = compact ? 36 : 76, right = width - left;
  const x = (move: number) => left + move / 12 * (right - left);
  const y = (probability: number) => 294 - probability * 188;
  const cdfPath = QUANTILES.map((point, index) => `${index ? "L" : "M"}${x(point.move)} ${y(point.p)}`).join(" ");
  const probability = probabilityAbove(threshold);
  const gateX = width * .54;

  return <DemoPlayer className={`quantiv-demo ${mulish.variable} ${mono.variable}`} label="Quantiv earnings research demonstration" eyebrow="Quantiv" title="From market price to verified forecast" stages={STAGES} note="Illustrative values, not live forecasts or trading recommendations" duration={5000}>
    {({ stage }) => <>
      <div className="qv-identity"><span className="qv-wordmark">Quantiv<span>.</span></span><span>Illustrative values</span></div>
      <div className="qv-research" data-stage={stage}>
        <section className="qv-scene" aria-hidden={stage !== 0} inert={stage !== 0}>
          <div className="qv-scene-heading"><span>01 / THE MARKET’S PRICE</span><h4>What does a move cost?</h4></div>
          <svg viewBox={`0 0 ${width} 360`} role="img" aria-label="A 3.20 dollar call and a 2.80 dollar put cost 6 dollars. Dividing by a 100 dollar stock price implies a 6 percent absolute move.">
            <defs><linearGradient id={`${id}-flow`}><stop stopColor="#006db5"/><stop offset="1" stopColor="#42c8ff"/></linearGradient></defs>
            <g className="qv-premium"><text x={left} y="137">CALL</text><text x={left} y="169" className="qv-price-number">$3.20</text><text x={right} y="137" textAnchor="end">PUT</text><text x={right} y="169" textAnchor="end" className="qv-price-number">$2.80</text></g>
            {[left + 15, right - 15].map((start, i) => <g key={i}>
              <path className="qv-flow-rail" d={`M${start} 186C${start} 241 ${width / 2} 180 ${width / 2} 234`} />
              <path className="qv-flow-pulse" d={`M${start} 186C${start} 241 ${width / 2} 180 ${width / 2} 234`} pathLength="100" stroke={`url(#${id}-flow)`} />
            </g>)}
            <text className="qv-implied" x={width / 2} y="150" textAnchor="middle">6<tspan fontSize="27">%</tspan></text>
            <text className="qv-label" x={width / 2} y="177" textAnchor="middle">($3.20 + $2.80) / $100</text>
            <path className="qv-axis" d={`M${left} 274H${right}`} />
            <rect className="qv-priced-range" x={left} y="265" width={x(6) - left} height="18" rx="9" />
            <circle className="qv-market-beacon" cx={x(6)} cy="274" r="5" />
            {[0, 3, 6, 9, 12].map(value => <text key={value} className="qv-axis-label" x={x(value)} y="309" textAnchor="middle">{value}%</text>)}
            <text className="qv-label" x={width / 2} y="342" textAnchor="middle">Absolute earnings move · up or down</text>
          </svg>
          <div className="qv-interaction qv-price-footnote">At-the-money straddle · before fees and spreads</div>
        </section>

        <section className="qv-scene" aria-hidden={stage !== 1} inert={stage !== 1}>
          <div className="qv-scene-heading"><span>02 / FIVE QUANTILE HEADS</span><h4>How much lies beyond?</h4></div>
          <svg viewBox={`0 0 ${width} 360`} role="img" aria-label={`Five quantiles of absolute earnings moves. ${probability.bounded ? 'At most' : 'An estimated'} ${probability.value.toFixed(1)} percent of moves exceed ${threshold} percent.`}>
            <defs><linearGradient id={`${id}-cdf`} x1="0" x2="0" y1="0" y2="1"><stop stopColor="#009aff" stopOpacity=".2"/><stop offset="1" stopColor="#009aff" stopOpacity="0"/></linearGradient></defs>
            <path className="qv-gridline" d={`M${left} ${y(.5)}H${right}M${left} ${y(.9)}H${right}`} />
            <path className="qv-cdf-fill" d={`${cdfPath}V294H${x(2)}Z`} fill={`url(#${id}-cdf)`}/>
            <path className="qv-cdf" d={cdfPath} pathLength="100" />
            {QUANTILES.map(point => <g key={point.p}>
              <path className="qv-quantile-drop" d={`M${x(point.move)} ${y(point.p)}V294`} />
              <circle cx={x(point.move)} cy={y(point.p)} r="4" className="qv-quantile-dot" />
              <text x={x(point.move)} y={y(point.p) - 13} textAnchor="middle" className="qv-quantile-label">P{point.p * 100}</text>
              <text x={x(point.move)} y="311" textAnchor="middle" className="qv-axis-label">{point.move}%</text>
            </g>)}
            <path className="qv-axis" d={`M${left} 294H${right}`} />
            <g className="qv-threshold" style={{ transform: `translateX(${x(threshold)}px)` }}>
              <path d="M0 96V293"/>
              {!probability.bounded && <circle cy={y(1 - probability.value / 100)} r="6" />}
            </g>
            <text className="qv-label" x={width / 2} y="342" textAnchor="middle">Absolute move · P50 is the median</text>
          </svg>
          <div className="qv-forecast-result" aria-live="polite"><strong>{probability.bounded ? "≤ " : ""}{probability.bounded ? probability.value.toFixed(0) : probability.value.toFixed(1)}%</strong><span>{probability.bounded ? "Tail bound" : "Estimated"} above a {threshold}% move</span></div>
          <div className="qv-interaction"><span>Market move</span>{[3,6,10].map(value => <button data-demo-interaction key={value} aria-label={`Compare a ${value}% market move`} aria-pressed={threshold === value} onClick={() => setThreshold(value)}>{value}%</button>)}</div>
        </section>

        <section className="qv-scene" aria-hidden={stage !== 2} inert={stage !== 2}>
          <div className="qv-scene-heading"><span>03 / WALK-FORWARD VALIDATION</span><h4>Let time move forward.</h4></div>
          <svg viewBox={`0 0 ${width} 360`} role="img" aria-label={`Four expanding training windows, each separated from a 60-day unseen test by a five-day purge. Fold ${fold + 1} is highlighted.`}>
            <defs><pattern id={`${id}-purge`} width="5" height="5" patternUnits="userSpaceOnUse"><path d="M-1 1L1-1M0 5L5 0M4 6L6 4" stroke="#ffbb6c" strokeWidth="1"/></pattern></defs>
            {[0,1,2,3].map(index => {
              const testWidth = (right - left) * .17;
              const purgeWidth = testWidth * 5 / 60;
              const end = left + (right - left) * .24 + index * testWidth;
              const row = 127 + index * 47;
              return <g key={index} className="qv-fold" data-active={fold === index}>
                <text x={left - 18} y={row + 4} className="qv-axis-label" textAnchor="middle">{index + 1}</text>
                <path className="qv-future" d={`M${left} ${row}H${right}`}/>
                <rect className="qv-train" x={left} y={row-9} width={end-left} height="18" rx="2"/>
                <rect x={end} y={row-14} width={purgeWidth} height="28" fill={`url(#${id}-purge)`}/>
                <rect className="qv-test" x={end+purgeWidth} y={row-9} width={testWidth} height="18" rx="2"/>
                <path className="qv-fold-scan" d={`M${left} ${row}H${end}`} pathLength="100" />
                <text className="qv-test-label" x={end+purgeWidth+testWidth/2} y={row+4} textAnchor="middle">60d</text>
              </g>;
            })}
            <path className="qv-time-arrow" d={`M${left} 321H${right}m-5-4 5 4-5 4`} />
            <text x={left} y="344" className="qv-label">Past</text><text x={right} y="344" textAnchor="end" className="qv-label">Future</text>
          </svg>
          <div className="qv-legend"><span className="qv-key-train">Train</span><span className="qv-key-purge">5-day gap</span><span className="qv-key-test">Unseen test</span></div>
          <div className="qv-interaction"><span>Inspect fold</span>{[0,1,2,3].map(value => <button data-demo-interaction key={value} aria-label={`Inspect fold ${value + 1}`} aria-pressed={fold === value} onClick={() => setFold(value)}>{value + 1}</button>)}</div>
        </section>

        <section className="qv-scene" aria-hidden={stage !== 3} inert={stage !== 3} data-corrupt={corrupt}>
          <div className="qv-scene-heading"><span>04 / VERIFIED MODEL DELIVERY</span><h4>Trust the next version.</h4></div>
          <svg viewBox={`0 0 ${width} 360`} role="img" aria-label={corrupt ? "The new bundle fails SHA-256 verification. Activation is blocked and the previous verified model remains active." : "The signed bundle passes its signature, SHA-256 digests and native model loading before atomic activation."}>
            <g className="qv-bundle" transform={`translate(${left + (compact ? 16 : 40)} 168)`}>
              {[2,1,0].map(layer => <g key={layer} transform={`translate(0 ${layer * 9})`}>
                <path d="M-26 0 0-15 26 0 0 15Z"/><path d="M-26 0V8L0 23 26 8V0L0 15Z"/>
              </g>)}
              <text x="0" y="70" textAnchor="middle" className="qv-label">Bundle v2</text>
            </g>
            <path className="qv-flow-rail" d={`M${left + (compact ? 49 : 79)} 190H${gateX-30}`}/>
            <path className="qv-flow-pulse" pathLength="100" d={`M${left + (compact ? 49 : 79)} 190H${gateX-30}`}/>
            {['Signature', 'SHA-256', 'Native load'].map((label, index) => <g key={label} className={`qv-checkpoint qv-checkpoint-${index}`} transform={`translate(${gateX} ${128 + index * 62})`}>
              <circle r="17"/>
              <path className="qv-check" d="m-6 0 4 4 8-8"/>
              {index===1 && <path className="qv-cross" d="m-5-5 10 10m0-10-10 10"/>}
              <text x="29" y="4">{label}</text>
            </g>)}
            <path className="qv-activation-route" d={`M${gateX} 272V300H${left + 25}V266`} />
            <circle className="qv-serving-ring" cx={left + 25} cy="288" r="18"/>
            <circle className="qv-serving-dot" cx={left + 25} cy="288" r="5"/>
            <text className="qv-label" x={left + 55} y="330">{corrupt ? "current → v1" : "current → v2"}</text>
          </svg>
          <div className="qv-serve-result" aria-live="polite">{corrupt ? "Previous model retained" : "New model active"}<span>{corrupt ? "SHA-256 mismatch · activation blocked" : "Signature + digests + load verified"}</span></div>
          <div className="qv-interaction"><button data-demo-interaction aria-pressed={!corrupt} onClick={() => setCorrupt(false)}>Verified bundle</button><button data-demo-interaction aria-pressed={corrupt} onClick={() => setCorrupt(true)}>Corrupt bundle</button></div>
        </section>
      </div>
    </>}
  </DemoPlayer>;
}
