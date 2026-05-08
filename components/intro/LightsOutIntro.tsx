"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "intro-played";
const LIGHT_INTERVAL = 850;

function subscribe() {
  return () => undefined;
}
function getSnapshot() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) !== "1";
}

type Phase = "lighting" | "hold" | "out" | "done";

export function LightsOutIntro() {
  const shouldPlay = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const [phase, setPhase] = useState<Phase>("lighting");
  const [litCount, setLitCount] = useState(0);

  const finish = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
    setPhase("done");
  }, []);

  useEffect(() => {
    if (!shouldPlay) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 5; i++) {
      timers.push(setTimeout(() => setLitCount(i), i * LIGHT_INTERVAL));
    }
    const onAt = 5 * LIGHT_INTERVAL;
    const holdMs = 400 + Math.floor(Math.random() * 700);
    timers.push(setTimeout(() => setPhase("hold"), onAt));
    timers.push(setTimeout(() => setPhase("out"), onAt + holdMs));
    timers.push(setTimeout(() => finish(), onAt + holdMs + 1100));
    return () => timers.forEach(clearTimeout);
  }, [shouldPlay, finish]);

  if (!shouldPlay && phase !== "done") return null;
  if (phase === "done") {
    // Render nothing once finished; the overlay fades away below before unmount.
  }

  // Hide entirely once done so it stops capturing pointer events.
  if (phase === "done") return null;

  return (
    <div
      className="intro-overlay"
      style={{
        opacity: 1,
        pointerEvents: "auto",
      }}
    >
      <div className="intro-vignette" />
      <div className="intro-grain" />

      <div className="intro-content">
        <div className="intro-meta">
          <span className="intro-meta-dot" />
          <span>FORMATION LAP COMPLETE — GRID SET</span>
        </div>

        <div className="intro-gantry">
          {[0, 1, 2, 3, 4].map((col) => (
            <div key={col} className="intro-pole">
              <div className="intro-pole-stem" />
              <div className="intro-pole-bar">
                {[0, 1].map((row) => {
                  const isLit =
                    phase === "out"
                      ? false
                      : phase === "hold" || col < litCount;
                  return (
                    <div
                      key={row}
                      className={`intro-light ${isLit ? "intro-light--on" : ""} ${
                        phase === "out" ? "intro-light--out" : ""
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="intro-readout">
          <div className="intro-readout-row">
            <span className="intro-readout-k">SESSION</span>
            <span className="intro-readout-v">RACE · LAP 01/56</span>
          </div>
          <div className="intro-readout-row">
            <span className="intro-readout-k">DRIVER</span>
            <span className="intro-readout-v">CHENG, K.</span>
          </div>
          <div className="intro-readout-row">
            <span className="intro-readout-k">STATUS</span>
            <span
              className={`intro-readout-v ${
                phase === "out" ? "intro-readout-v--accent" : ""
              }`}
            >
              {phase === "lighting" && `LIGHTS ${litCount}/5`}
              {phase === "hold" && "HOLD…"}
              {phase === "out" && "LIGHTS OUT — GO GO GO"}
            </span>
          </div>
        </div>
      </div>

      <button type="button" className="intro-skip" onClick={finish}>
        SKIP &gt;&gt;
      </button>

      {phase === "out" && <div className="intro-flash" />}
    </div>
  );
}
