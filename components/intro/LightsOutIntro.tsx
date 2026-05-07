"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "intro-played";
const LIGHT_INTERVAL_MS = 1000;
const HOLD_MS = 900;
const EXIT_MS = 500;

function subscribeToIntroStore() {
  return () => undefined;
}

function getIntroSnapshot() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) !== "1";
}

export function LightsOutIntro() {
  const shouldPlay = useSyncExternalStore(
    subscribeToIntroStore,
    getIntroSnapshot,
    () => false,
  );
  const [phase, setPhase] = useState<"lighting" | "hold" | "out" | "done">(
    "lighting",
  );
  const [litCount, setLitCount] = useState(0);
  const reduceMotion = useReducedMotion();

  const finish = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, "1");
    }
    setPhase("done");
  }, []);

  useEffect(() => {
    if (!shouldPlay) return;

    if (reduceMotion) {
      const t = setTimeout(() => finish(), 250);
      return () => clearTimeout(t);
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 1; i <= 5; i++) {
      timers.push(setTimeout(() => setLitCount(i), i * LIGHT_INTERVAL_MS));
    }

    const allLightsOnAt = 5 * LIGHT_INTERVAL_MS;
    timers.push(setTimeout(() => setPhase("hold"), allLightsOnAt));
    timers.push(setTimeout(() => setPhase("out"), allLightsOnAt + HOLD_MS));
    timers.push(
      setTimeout(() => finish(), allLightsOnAt + HOLD_MS + EXIT_MS),
    );

    return () => timers.forEach(clearTimeout);
  }, [finish, reduceMotion, shouldPlay]);

  function skip() {
    finish();
  }

  if (!shouldPlay && phase !== "done") return null;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
        >
          {/* Carbon backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-80"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at center, rgba(40,0,0,0.4) 0%, rgba(0,0,0,0.95) 70%)",
            }}
          />

          <div className="relative flex flex-col items-center gap-8 px-6">
            <p className="telemetry-accent">FORMATION LAP COMPLETE</p>

            <div className="flex gap-3 md:gap-5">
              {[0, 1, 2, 3, 4].map((i) => {
                const isLit =
                  phase === "lighting" ? i < litCount : phase === "hold";
                return (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{
                      backgroundColor: isLit
                        ? "rgb(220, 0, 0)"
                        : "rgb(20, 20, 22)",
                      boxShadow: isLit
                        ? "0 0 40px rgba(220,0,0,0.85), inset 0 0 16px rgba(255,80,80,0.6)"
                        : "0 0 0 rgba(0,0,0,0)",
                    }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="h-14 w-12 md:h-20 md:w-16 rounded-sm border border-white/10"
                  />
                );
              })}
            </div>

            <div className="h-[1px] w-48 bg-white/10" />

            <p
              className={`telemetry transition-colors ${
                phase === "out" ? "text-accent" : ""
              }`}
            >
              {phase === "lighting" && `LIGHTS ${litCount}/5`}
              {phase === "hold" && "HOLD"}
              {phase === "out" && "LIGHTS OUT AND AWAY WE GO"}
            </p>
          </div>

          <button
            type="button"
            onClick={skip}
            className="absolute bottom-6 right-6 telemetry hover:text-accent transition-colors"
          >
            SKIP &gt;&gt;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
