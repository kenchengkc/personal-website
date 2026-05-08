"use client";

import { useEffect, useLayoutEffect, useState } from "react";

const STORAGE_KEY = "intro-played";
const LIGHT_INTERVAL = 500;

type Phase = "lighting" | "hold" | "out" | "done";

// useLayoutEffect on client, no-op on server (avoids SSR warning).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function LightsOutIntro() {
  // Render visible on SSR + first client paint so the homepage never flashes.
  const [phase, setPhase] = useState<Phase>("lighting");
  const [litCount, setLitCount] = useState(0);
  const [skipFade, setSkipFade] = useState(false);

  // Returning visitors: hide the overlay synchronously before paint.
  useIsoLayoutEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setSkipFade(true);
      setPhase("done");
    }
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= 5; i++) {
      timers.push(setTimeout(() => setLitCount(i), i * LIGHT_INTERVAL));
    }
    const onAt = 5 * LIGHT_INTERVAL;
    const holdMs = 400 + Math.floor(Math.random() * 700);
    timers.push(setTimeout(() => setPhase("hold"), onAt));
    timers.push(
      setTimeout(() => {
        setLitCount(0);
        setPhase("out");
      }, onAt + holdMs),
    );
    timers.push(
      setTimeout(() => {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setPhase("done");
      }, onAt + holdMs + 1100),
    );

    return () => timers.forEach(clearTimeout);
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function skip() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setPhase("done");
  }

  const done = phase === "done";

  return (
    <div
      className="intro-overlay"
      aria-hidden={done}
      style={{
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "auto",
        transition: skipFade ? "none" : undefined,
      }}
    >
      <div className="intro-vignette" />
      <div className="intro-grain" />

      <div className="intro-content">
        <div className="intro-meta">
          <span className="intro-meta-dot" />
          <span>FORMATION LAP COMPLETE - GRID SET</span>
        </div>

        <div className="intro-gantry">
          {[0, 1, 2, 3, 4].map((col) => (
            <div key={col} className="intro-pole">
              <div className="intro-pole-stem" />
              <div className="intro-pole-bar">
                {[0, 1].map((row) => {
                  const lightsAreOut = phase === "out" || phase === "done";
                  const isLit =
                    !lightsAreOut && (phase === "hold" || col < litCount);
                  return (
                    <div
                      key={row}
                      className={`intro-light ${isLit ? "intro-light--on" : ""} ${
                        lightsAreOut ? "intro-light--out" : ""
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
              {phase === "out" && "LIGHTS OUT - GO GO GO"}
            </span>
          </div>
        </div>
      </div>

      <button type="button" className="intro-skip" onClick={skip}>
        SKIP &gt;&gt;
      </button>

      {phase === "out" && <div className="intro-flash" />}
    </div>
  );
}
