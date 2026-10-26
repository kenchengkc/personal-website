"use client";

import Image from "next/image";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { AsterArtwork, GcinfArtwork, WassersteinArtwork } from "./ResearchArtwork";

// These imports only run when their slot approaches the viewport. In particular,
// video posters and SVG images must not compete with the opening animation.
const AmazonArtwork = lazy(() => import("./AmazonArtwork").then(module => ({ default: module.AmazonArtwork })));
const ModelArtwork = lazy(() => import("./ModelArtwork").then(module => ({ default: module.ModelArtwork })));
const SpeedArtwork = lazy(() => import("./SpeedArtwork").then(module => ({ default: module.SpeedArtwork })));
const ProductFlowArtwork = lazy(() => import("./ProductFlowArtwork").then(module => ({ default: module.ProductFlowArtwork })));
const ProductBrowserPreview = lazy(() => import("./ProductBrowserPreview").then(module => ({ default: module.ProductBrowserPreview })));
const CvrpArtwork = lazy(() => import("./CvrpArtwork").then(module => ({ default: module.CvrpArtwork })));

export type ArtworkKind =
  | "amazon" | "quantiv" | "fdre" | "embers"
  | "cml" | "wasserstein" | "aster" | "gcinf"
  | "usaco" | "speed" | "cvrp";

function UsacoArtwork() {
  return (
    <>
      <Image className="artwork-usaco-logo" src="/images/usaco/usaco-logo.png" alt="USA Computing Olympiad" width={900} height={130} sizes="(max-width: 700px) 60vw, 280px" />
      <div className="artwork-score">1000<span>/1000</span><small>Gold division score</small></div>
      <div className="artwork-division">Gold → Platinum</div>
    </>
  );
}

const animatedKinds = new Set<ArtworkKind>(["amazon", "quantiv", "fdre", "embers", "cml", "speed", "cvrp"]);

/** Reserve the real window's dimensions without fetching a poster or scene. */
function ArtworkPlaceholder({ kind }: { kind: ArtworkKind }) {
  const recording = kind === "quantiv" || kind === "fdre";
  const window = recording || kind === "amazon" || kind === "embers";
  if (!window) {
    if (kind === "cml") return <div className="artwork-placeholder" aria-hidden="true" />;
    return <div className="artwork-placeholder artwork-placeholder-result" aria-hidden="true">
      {kind === "speed" ? <>
        <div className="speed-scene-heading"><span>&nbsp;</span><span>&nbsp;</span></div>
        <div className="speed-viewport" />
        <div className="speed-source"><span>&nbsp;</span></div>
      </> : <>
        <div className="cvrp-heading"><span>&nbsp;</span></div>
        <div className="artwork-placeholder-routing-map" />
        <div className="cvrp-loads">
          {[0, 1, 2].map(index => <div key={index}>
            <div className="cvrp-load-label"><span>&nbsp;</span></div>
            <div className="cvrp-capacity-track" />
          </div>)}
        </div>
        <div className="cvrp-provenance"><span>&nbsp;</span></div>
      </>}
      <div className="animated-artwork-footer">
        <p>{kind === "speed" ? "Original pressure contours on the optimized rear-wing model." : "Explore depot-to-depot routes that fit each vehicle’s capacity."}</p>
        <div className="artwork-placeholder-controls" />
      </div>
    </div>;
  }

  return <div className={`artwork-placeholder artwork-placeholder-window${recording ? " artwork-placeholder-recording" : ""}`} aria-hidden="true">
    <div className="product-browser-titlebar artwork-window-titlebar">
      <div className="product-browser-dots">
        {["red", "yellow", "green"].map(color => <span key={color} className="product-browser-dot"><span className={`product-browser-light is-${color}`} /></span>)}
      </div>
    </div>
    <div className="artwork-placeholder-screen" />
    {recording ? <div className="product-browser-footer" /> : <div className="animated-artwork-footer">
      <p>{kind === "amazon" ? "A versioned JSON diff isolates the changed forecasting input." : "Identify the refrigerator in the camera frame."}</p>
      {kind === "amazon" && <div className="animated-artwork-playground" />}
      <div className="artwork-placeholder-controls" />
    </div>}
  </div>;
}

export function ProjectArtwork({ kind }: { kind: ArtworkKind }) {
  const slot = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(false);
  const deferred = animatedKinds.has(kind);

  useEffect(() => {
    if (!deferred || reached || !slot.current) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        // Keep the scene mounted after visiting it so tabs retain manual choices,
        // video playback position, and the existing focus-window behavior.
        setReached(true);
        observer.disconnect();
      }
    }, { rootMargin: "400px 0px" });
    observer.observe(slot.current);
    return () => observer.disconnect();
  }, [deferred, reached]);

  function content() {
    switch (kind) {
      case "amazon": return <AmazonArtwork />;
      case "quantiv": case "fdre": return <ProductBrowserPreview kind={kind} />;
      case "embers": return <ProductFlowArtwork kind={kind} />;
      case "cml": return <ModelArtwork />;
      case "wasserstein": return <WassersteinArtwork />;
      case "aster": return <AsterArtwork />;
      case "gcinf": return <GcinfArtwork />;
      case "usaco": return <UsacoArtwork />;
      case "speed": return <SpeedArtwork />;
      case "cvrp": return <CvrpArtwork />;
    }
  }

  return (
    <div ref={slot} className={`project-artwork artwork-${kind}${deferred ? " artwork-deferred" : ""}`} data-artwork={kind}>
      <div className="artwork-content">
        {deferred ? <Suspense fallback={<ArtworkPlaceholder kind={kind} />}>
          {reached ? content() : <ArtworkPlaceholder kind={kind} />}
        </Suspense> : content()}
      </div>
    </div>
  );
}
