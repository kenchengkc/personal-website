"use client";

import { useId, useLayoutEffect, useRef } from "react";
import styles from "./transfer-diagram.module.css";

type Model = "Llama" | "Qwen";

function Cartridge({ model, id }: { model: Model; id: string }) {
  const qwen = model === "Qwen";
  const edge = qwen ? "#ffcb89" : "#8bdfcf";

  return <g strokeLinejoin="round">
    {/* Both cartridges terminate in the very same keyed connector. */}
    <path d="M168 88h62l20 12v11h-62l-20-12Z" fill="#4c4030" stroke="#9c7951" />
    <path d="M168 88h62l20 12h-62Z" fill="#ad8957" />
    <path d="M188 100h62v11h-62Z" fill="#645034" />
    {[0, 1, 2, 3].map(pin => <path key={pin} transform={`translate(${pin * 4.2} ${pin * 2.5})`}
      d="M207 90h24l2 1.3h-24Z" fill="#ffdc99" />)}

    {/* The differing input packages sit on identically shaped output shoulders. */}
    <path d={qwen
      ? "M28 88 40 76h62l16 9h53l26 16 7 8v17H66L28 105Z"
      : "M31 82h76l16 7h48l26 12 7 8v17H66l-35-21Z"}
      fill={`url(#${id}-shell)`} stroke="#5b7078" />
    <path d={qwen
      ? "M28 88 40 76h62l16 9h53l26 16 7 8H66Z"
      : "M31 82h76l16 7h48l26 12 7 8H66Z"}
      fill={qwen ? "#514537" : "#315450"} stroke={edge} strokeOpacity=".66" />
    <path d="M66 109h138v6H66Z" fill="#52616a" />
    <path d="M66 115h137v11H66Z" fill="#252f38" />
    <path d="M72 118h72" stroke={edge} strokeWidth="2" />
    <path d="M157 120h34" stroke="#53636b" strokeWidth="2" />
    <path d="m120 91 9 5h10m-21-2 11 7h15m24-9 9 5h7" stroke={edge} strokeOpacity=".75" />
    <path d="m138 93 14-6 21 11-14 6Z" fill="#14282e" stroke={edge} />
    <path d="m146 93 6-2 11 6-6 2Z" fill={edge} />
    {qwen
      ? <g>
          {[0, 1, 2, 3, 4].map(layer => <g key={layer} transform={`translate(0 ${-layer * 6})`}>
            <path d="M39 89a38 12 0 0 1 76 0v4a38 12 0 0 1-76 0Z" fill="#513f34" stroke="#c38d5f" />
            <ellipse cx="77" cy="89" rx="38" ry="12" fill={`url(#${id}-amber)`} stroke="#ddb480" />
          </g>)}
          <ellipse cx="77" cy="65" rx="24" ry="6.6" fill="#352d29" stroke="#e3b483" />
          <ellipse cx="77" cy="65" rx="12" ry="3.3" fill="#ffce94" />
        </g>
      : <g>
          {[0, 1, 2, 3].map(layer => <g key={layer} transform={`translate(0 ${-layer * 7})`}>
            <path d="m39 80 47-5 26 15v5l-47 6-26-16Z" fill="#24443f" stroke="#73b5ad" />
            <path d="m39 80 47-5 26 15-47 6Z" fill={`url(#${id}-teal)`} stroke="#9ed6ca" />
          </g>)}
          <path d="m55 60 27-3 14 8-26 3Z" fill="#253e3f" stroke="#b6e5d6" />
          <path d="m67 61 12-1.3 6 3.6-12 1.3Z" fill="#c3f5e7" />
        </g>}
  </g>;
}

export function TransferDiagram({ model }: { model: Model }) {
  const id = useId().replace(/:/g, "");
  const scene = useRef<SVGSVGElement>(null);
  const previous = useRef<Model | null>(null);
  const qwen = model === "Qwen";
  const label = qwen
    ? "Proposed Qwen transfer. Compress each of its 36 layers and fit a new Qwen adapter with labeled replies. Its connector fits the same locked classifier."
    : "Proposed Llama training. Compress each of its 32 layers and train the Llama adapter and the shared classifier together with labeled replies.";

  useLayoutEffect(() => {
    if (!scene.current || previous.current === model) return;
    const artwork = scene.current.closest<HTMLElement>(".animated-artwork");
    const manualChange = artwork?.dataset.motionActive === "true" && scene.current.closest('[data-choice-motion="true"]');
    scene.current.dataset.entry = artwork?.dataset.running === "true" || manualChange
      ? previous.current ? "swap" : "dock"
      : "still";
    previous.current = model;
  }, [model]);

  return <svg ref={scene} className={styles.drawing} viewBox="7 31 385 166" role="img" aria-label={label} fill="none">
    <defs>
      <linearGradient id={`${id}-shell`} x2=".3" y2="1">
        <stop stopColor="#8095a0" /><stop offset=".48" stopColor="#485b66" /><stop offset="1" stopColor="#283640" />
      </linearGradient>
      <linearGradient id={`${id}-roof`} x1="0" y1="1" x2="1" y2="0">
        <stop stopColor="#71838a" /><stop offset="1" stopColor="#36454f" />
      </linearGradient>
      <linearGradient id={`${id}-teal`}><stop stopColor="#5e9b93" /><stop offset=".6" stopColor="#47756d" /><stop offset="1" stopColor="#9accc1" /></linearGradient>
      <linearGradient id={`${id}-amber`}><stop stopColor="#80644e" /><stop offset=".45" stopColor="#b18e69" /><stop offset="1" stopColor="#594939" /></linearGradient>
      <radialGradient id={`${id}-glass`} cx=".55" cy=".86" r=".95">
        <stop stopColor="#305552" /><stop offset=".65" stopColor="#1a3338" /><stop offset="1" stopColor="#101f26" />
      </radialGradient>
      <radialGradient id={`${id}-shadow`}><stop stopColor="#030c12" stopOpacity=".8" /><stop offset="1" stopColor="#030c12" stopOpacity="0" /></radialGradient>
    </defs>

    <ellipse cx="225" cy="147" rx="180" ry="25" fill={`url(#${id}-shadow)`} />
    {/* The guide rails and classifier remain bolted down during the exchange. */}
    <g strokeLinejoin="round">
      <path d="M24 118h208l18 11H42Z" fill="#1d3039" stroke="#40545c" />
      <path d="M52 135h207l7 4H59Z" fill="#283c44" stroke="#53636b" />
      <path d="M246 118h107l28 22v14l-8 7h-94l-42-23v-15Z" fill="#192b32" stroke="#516873" />
      <path d="M240 48h96l42 25v78l-6 5h-95l-42-25V54Z" fill="#2e424c" stroke="#80939a" />
      <path d="M240 48h96l42 25H278l-43-19Z" fill={`url(#${id}-roof)`} stroke="#87999e" />
      <path d="m235 54 43 23v76l-43-23Z" fill="#253641" stroke="#647983" />
      <path d="m238 78 32 18v37l-32-18Z" fill="#0a151b" stroke="#9baea9" strokeWidth="2" />
      <path d="m242 84 23 14v26l-23-13Z" stroke="#b19569" strokeWidth="2" />
      <rect x="277" y="74" width="100" height="79" rx="4" fill={`url(#${id}-shell)`} stroke="#7f919b" />
      <path d="m253 53 64 0 19 11h-64Z" fill="#253b43" stroke="#829394" />
      {[0, 1, 2, 3, 4].map(vent => <path key={vent} d={`m${261 + vent * 10} 55 12 6`} stroke="#71858a" strokeWidth="2" />)}
    </g>

    <g key={model}>
      <g className={styles.outgoing} aria-hidden="true"><Cartridge model={qwen ? "Llama" : "Qwen"} id={id} /></g>
      <g className={styles.incoming}><Cartridge model={model} id={id} /></g>
    </g>
    <path d="m268 95 5 3v34l-5-3Z" fill="#81969a" />
    <g strokeLinejoin="round">
      <rect x="283" y="81" width="88" height="47" rx="5" fill="#0d1c23" stroke="#89999d" />
      <path d="M288 121v-35h78v35Z" fill={`url(#${id}-glass)`} />
      <path d="M301 115a26 26 0 0 1 52 0" stroke="#526866" strokeWidth="4" />
      <path d="M301 115a26 26 0 0 1 35-24.3" stroke="#9cb9ae" strokeWidth="3" />
      <path d="m336 90 2-4" stroke="#ffcd8d" strokeWidth="2" />
      <g className={qwen ? styles.fixedNeedle : styles.tuningNeedle}>
        <path d="m325 115 12-22-8 24Z" fill="#ffe1a5" />
      </g>
      <circle cx="327" cy="116" r="3.5" fill="#7c9090" stroke="#d2ded0" />
      <path d="M286 85h61" stroke="#c6dcd6" strokeOpacity=".25" />
      <g stroke={qwen ? "#9fe5cf" : "#ffce91"} strokeWidth="1.7" strokeLinecap="round">
        {qwen
          ? <><path d="M290 138v-2.5a3 3 0 0 1 6 0v2.5" /><rect x="288.5" y="138" width="9" height="7" rx="1.5" /></>
          : <><circle cx="293" cy="140" r="4.7" /><path d="m293 140 2-3.5" /></>}
      </g>
      <text x="303" y="146" fontSize="15" fill={qwen ? "#bee9d9" : "#ffe0ac"}>{qwen ? "Locked" : "Training"}</text>
    </g>

    <g stroke="#798c94" strokeWidth="1.2">
      <path d="M123 129v27l-13 9" /><path d="M329 158v11" />
    </g>
    <g fill="#e3edf0" fontSize="16" fontWeight="550" textAnchor="middle">
      <text x="100" y="186">{model} adapter</text>
      <text x="320" y="188">Shared classifier</text>
    </g>
  </svg>;
}
