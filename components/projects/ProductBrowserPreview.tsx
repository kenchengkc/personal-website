"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
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

function revealPresentedFrame(player: HTMLVideoElement) {
  const reveal = () => {
    if (player.readyState >= 2 && !player.seeking) player.dataset.frameReady = "true";
  };
  const afterPaint = () => requestAnimationFrame(() => requestAnimationFrame(reveal));
  // A loaded/playing event can precede the first presented frame. Keep the
  // poster over each player until the browser can actually show its video.
  // A paused seek may have already presented its only frame, so it cannot
  // depend on another video-frame callback. Allow the decoded seek one paint.
  if (player.paused && player.readyState >= 2 && !player.seeking) afterPaint();
  else if (typeof player.requestVideoFrameCallback === "function") player.requestVideoFrameCallback(reveal);
  else if (player.readyState >= 2) afterPaint();
}

export function ProductBrowserPreview({ kind }: { kind: keyof typeof products }) {
  const product = products[kind];
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const enlargedVideo = useRef<HTMLVideoElement>(null);
  const expandButton = useRef<HTMLButtonElement>(null);
  const resumeTime = useRef(0);
  const [expanded, setExpanded] = useState(false);
  const [inView, setInView] = useState(false);
  const [intent, setIntent] = useState<"auto" | "play" | "pause">("auto");
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const visible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const shouldPlay = (expanded || inView) && visible && (intent === "play" || (intent === "auto" && !reducedMotion));

  function activeVideo() {
    return dialog.current?.open ? enlargedVideo.current : video.current;
  }

  function restorePosition(player: HTMLVideoElement | null) {
    if (!player) return;
    if (player.readyState >= 1) player.currentTime = resumeTime.current;
    else if (resumeTime.current > 0) player.load();
  }

  useLayoutEffect(() => {
    if (!expanded || !dialog.current) return;
    const modal = dialog.current;
    const page = document.documentElement;
    const overflow = page.style.overflow;
    const gutter = page.style.scrollbarGutter;
    page.style.setProperty("scrollbar-gutter", "stable");
    page.style.setProperty("overflow", "hidden");
    modal.showModal();
    restorePosition(enlargedVideo.current);
    return () => {
      if (modal.open) modal.close();
      page.style.setProperty("overflow", overflow);
      page.style.setProperty("scrollbar-gutter", gutter);
    };
  }, [expanded]);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting && entry.intersectionRatio >= .25);
    }, { threshold: .25 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const player = expanded ? enlargedVideo.current : video.current;
    if (!player) return;
    if (shouldPlay) {
      // A browser may decline automatic playback; the explicit play control remains available.
      void player.play().catch(() => {});
    } else {
      player.pause();
    }
    return () => player.pause();
  }, [shouldPlay, expanded]);

  function expand() {
    const player = video.current;
    if (player && player.readyState >= 1) resumeTime.current = player.currentTime;
    setIntent(player?.paused ? "pause" : "play");
    player?.pause();
    setPlaying(false);
    setExpanded(true);
  }

  function restorePreview() {
    const player = enlargedVideo.current;
    if (player && player.readyState >= 1) resumeTime.current = player.currentTime;
    setIntent(player?.paused ? "pause" : "play");
    player?.pause();
    restorePosition(video.current);
    setPlaying(false);
    setExpanded(false);
    expandButton.current?.focus({ preventScroll: true });
  }

  function updatePlaying(event: SyntheticEvent<HTMLVideoElement>, value: boolean) {
    if (event.currentTarget === activeVideo()) setPlaying(value);
  }

  function pause() {
    activeVideo()?.pause();
    setIntent("pause");
  }

  function play(restart = false) {
    const player = activeVideo();
    if (restart && player) {
      resumeTime.current = 0;
      player.currentTime = 0;
    }
    setIntent("play");
    // Keep an explicit click in the browser's user-activation event, including
    // retrying when it declined an earlier automatic playback request.
    if (player && (expanded || inView) && visible) void player.play().catch(() => {});
  }

  function windowContent(enlarged: boolean) {
    return <div ref={enlarged ? undefined : root} className="product-browser-preview" data-preview={kind} data-playing={playing} role={enlarged ? undefined : "figure"} aria-label={enlarged ? undefined : `${product.name} recorded product demo`}>
      <div className="product-browser-titlebar">
        <div className="product-browser-dots">
          {enlarged
            ? <button type="button" className="product-browser-dot" aria-label={`Close ${product.name} preview`} title="Close preview" onClick={() => dialog.current?.close()}><span className="product-browser-light is-red" /></button>
            : <span className="product-browser-dot" aria-hidden="true"><span className="product-browser-light is-red" /></span>}
          <span className="product-browser-dot" aria-hidden="true"><span className="product-browser-light is-yellow" /></span>
          <button
            ref={enlarged ? undefined : expandButton}
            type="button"
            className="product-browser-dot"
            aria-label={`${enlarged ? "Restore" : "Expand"} ${product.name} preview`}
            aria-haspopup={enlarged ? undefined : "dialog"}
            aria-expanded={enlarged ? undefined : expanded}
            title={enlarged ? "Restore preview" : "Expand preview"}
            onClick={enlarged ? () => dialog.current?.close() : expand}
          ><span className="product-browser-light is-green" /></button>
        </div>
        <span className="product-browser-domain">{product.domain}</span>
      </div>
      <div className="product-browser-screen">
        <video
          ref={enlarged ? enlargedVideo : video}
          src={`/media/${kind}-preview.mp4`}
          preload="none"
          muted
          playsInline
          loop
          aria-label={`Silent recording of ${product.name} in use`}
          onLoadStart={event => { delete event.currentTarget.dataset.frameReady; }}
          onLoadedMetadata={event => {
            if (event.currentTarget === activeVideo()) event.currentTarget.currentTime = resumeTime.current;
            revealPresentedFrame(event.currentTarget);
          }}
          onLoadedData={event => revealPresentedFrame(event.currentTarget)}
          onSeeked={event => revealPresentedFrame(event.currentTarget)}
          onPlay={event => updatePlaying(event, true)}
          onPause={event => updatePlaying(event, false)}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- Preserve the recording's native poster URL and browser-controlled lazy loading. */}
        <img
          className="product-browser-poster"
          src={`/media/${kind}-preview-poster.jpg`}
          width={1000} height={680} alt=""
          loading={enlarged ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={enlarged ? "auto" : "low"}
        />
      </div>
      <div className="product-browser-footer">
        <div className="product-browser-controls">
          <button type="button" aria-label={`${playing ? "Pause" : "Play"} ${product.name} demo`} onClick={() => playing ? pause() : play()}>
            {playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
          </button>
          <button type="button" aria-label={`Replay ${product.name} demo`} onClick={() => play(true)}><RotateCcw size={13} aria-hidden="true" /></button>
          <span className="product-browser-caption">Recorded demo</span>
        </div>
        <a href={product.url} target="_blank" rel="noopener noreferrer">Open {product.name}<ArrowUpRight size={13} aria-hidden="true" /></a>
      </div>
    </div>;
  }

  return (
    <>
      {windowContent(false)}
      {expanded && createPortal(
        <dialog
          ref={dialog}
          className="product-browser-dialog"
          aria-label={`${product.name} enlarged preview`}
          onClose={restorePreview}
          onClick={event => {
            if (event.target !== event.currentTarget) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
          }}
        >
          {windowContent(true)}
        </dialog>,
        document.body,
      )}
    </>
  );
}
