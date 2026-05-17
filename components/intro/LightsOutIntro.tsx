"use client";

import { useEffect, useLayoutEffect, useState } from "react";

const STORAGE_KEY = "intro-played";
/** Delay between each of the 5 lights (0.3s); fifth at 1.5s total. */
const LIGHT_INTERVAL = 300;
/** After all five lights are on, brief pause before lights out (was ~400–1100ms). */
const HOLD_MS_MIN = 90;
const HOLD_MS_RANDOM = 160;
/** How long "GO GO GO" / flash stay visible before the overlay is dismissed (was 1100ms). */
const GO_PHASE_MS = 520;

type Phase = "lighting" | "hold" | "out" | "done";

function introFinished() {
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

// useLayoutEffect on client, no-op on server (avoids SSR warning).
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function LightsOutIntro() {
  // Render visible on SSR + first client paint so the homepage never flashes.
  const [phase, setPhase] = useState<Phase>("lighting");
  const [litCount, setLitCount] = useState(0);

  // Returning visitors: hide the overlay synchronously before paint.
  useIsoLayoutEffect(() => {
    if (introFinished()) {
      setPhase("done");
    }
  }, []);

  const overlayActive = phase !== "done";

  useLayoutEffect(() => {
    if (!overlayActive || typeof document === "undefined") return;

    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyLeft = body.style.left;
    const prevBodyRight = body.style.right;
    const prevBodyWidth = body.style.width;
    const prevBodyTouchAction = body.style.touchAction;
    const prevHtmlOverscroll = html.style.overscrollBehavior;

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    const preventWheel = (e: WheelEvent) => {
      e.preventDefault();
    };
    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    window.addEventListener("wheel", preventWheel, { passive: false });
    document.addEventListener("touchmove", preventTouchMove, {
      passive: false,
    });

    return () => {
      window.removeEventListener("wheel", preventWheel);
      document.removeEventListener("touchmove", preventTouchMove);
      html.style.overflow = prevHtmlOverflow;
      html.style.overscrollBehavior = prevHtmlOverscroll;
      body.style.overflow = prevBodyOverflow;
      body.style.touchAction = prevBodyTouchAction;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.left = prevBodyLeft;
      body.style.right = prevBodyRight;
      body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [overlayActive]);

  useEffect(() => {
    if (introFinished()) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const guard = (fn: () => void) => {
      if (introFinished()) return;
      fn();
    };

    for (let i = 1; i <= 5; i++) {
      timers.push(
        setTimeout(() => guard(() => setLitCount(i)), i * LIGHT_INTERVAL),
      );
    }
    const onAt = 5 * LIGHT_INTERVAL;
    const holdMs = HOLD_MS_MIN + Math.floor(Math.random() * HOLD_MS_RANDOM);
    timers.push(
      setTimeout(() => guard(() => setPhase("hold")), onAt),
    );
    timers.push(
      setTimeout(
        () =>
          guard(() => {
            setLitCount(0);
            setPhase("out");
          }),
        onAt + holdMs,
      ),
    );
    timers.push(
      setTimeout(
        () =>
          guard(() => {
            sessionStorage.setItem(STORAGE_KEY, "1");
            setPhase("done");
          }),
        onAt + holdMs + GO_PHASE_MS,
      ),
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  function skip() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setPhase("done");
  }

  if (phase === "done") {
    return null;
  }

  return (
    <div className="intro-overlay" aria-hidden={false}>
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
                  const lightsAreOut = phase === "out";
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
