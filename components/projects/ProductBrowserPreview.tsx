"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";

const products = {
  quantiv: { name: "Quantiv", domain: "usequantiv.com", url: "https://usequantiv.com" },
  fdre: { name: "FDRE", domain: "thefdre.com", url: "https://thefdre.com" },
} as const;

function subscribeMotion(callback: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", callback);
  return () => preference.removeEventListener("change", callback);
}

function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

export function ProductBrowserPreview({ kind }: { kind: keyof typeof products }) {
  const product = products[kind];
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [intent, setIntent] = useState<"auto" | "play" | "pause">("auto");
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const visible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const shouldPlay = inView && visible && (intent === "play" || (intent === "auto" && !reducedMotion));

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio >= .25);
    }, { threshold: .25 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const player = video.current;
    if (!player) return;
    if (shouldPlay) {
      // A browser may decline automatic playback; the explicit play control remains available.
      void player.play().catch(() => {});
    } else {
      player.pause();
    }
    return () => player.pause();
  }, [shouldPlay]);

  function play(restart = false) {
    const player = video.current;
    if (restart && player) player.currentTime = 0;
    setIntent("play");
    // Keep an explicit click in the browser's user-activation event, including
    // retrying when it declined an earlier automatic playback request.
    if (player && inView && visible) void player.play().catch(() => {});
  }

  return (
    <div ref={root} className="product-browser-preview" data-preview={kind} data-playing={playing} role="figure" aria-label={`${product.name} recorded product demo`}>
      <div className="product-browser-titlebar">
        <div className="product-browser-dots" aria-hidden="true"><span /><span /><span /></div>
        <span className="product-browser-domain">{product.domain}</span>
      </div>
      <div className="product-browser-screen">
        <video
          ref={video}
          src={`/media/${kind}-preview.mp4`}
          poster={`/media/${kind}-preview-poster.jpg`}
          preload="none"
          muted
          playsInline
          loop
          aria-label={`Silent recording of ${product.name} in use`}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      </div>
      <div className="product-browser-footer">
        <div className="product-browser-controls">
          <button type="button" aria-label={`${playing ? "Pause" : "Play"} ${product.name} demo`} onClick={() => playing ? setIntent("pause") : play()}>
            {playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
          </button>
          <button type="button" aria-label={`Replay ${product.name} demo`} onClick={() => play(true)}><RotateCcw size={13} aria-hidden="true" /></button>
          <span className="product-browser-caption">Recorded demo</span>
        </div>
        <a href={product.url} target="_blank" rel="noopener noreferrer">Open {product.name}<ArrowUpRight size={13} aria-hidden="true" /></a>
      </div>
    </div>
  );
}
