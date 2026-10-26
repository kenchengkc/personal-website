"use client";

import Image from "next/image";
import { AmazonArtwork } from "./AmazonArtwork";
import { ModelArtwork } from "./ModelArtwork";
import { AsterArtwork, WassersteinArtwork } from "./ResearchArtwork";
import { SpeedArtwork } from "./SpeedArtwork";
import { ProductFlowArtwork } from "./ProductFlowArtwork";
import { ProductBrowserPreview } from "./ProductBrowserPreview";

export type ArtworkKind =
  | "amazon" | "quantiv" | "fdre" | "embers"
  | "cml" | "wasserstein" | "aster" | "gcinf"
  | "usaco" | "speed" | "cvrp";

const imageSizes = "(max-width: 700px) calc(100vw - 40px), (max-width: 1200px) 44vw, 480px";

function UsacoArtwork() {
  return (
    <>
      <Image className="artwork-usaco-logo" src="/images/usaco/usaco-logo.png" alt="USA Computing Olympiad" width={900} height={130} sizes="(max-width: 700px) 60vw, 280px" />
      <div className="artwork-score">1000<span>/1000</span><small>Gold division score</small></div>
      <div className="artwork-division">Gold → Platinum</div>
    </>
  );
}

export function ProjectArtwork({ kind }: { kind: ArtworkKind }) {

  function content() {
    switch (kind) {
      case "amazon": return <AmazonArtwork />;
      case "quantiv": case "fdre": return <ProductBrowserPreview kind={kind} />;
      case "embers": return <ProductFlowArtwork kind={kind} />;
      case "cml": return <ModelArtwork />;
      case "wasserstein": return <WassersteinArtwork />;
      case "aster": return <AsterArtwork />;
      case "gcinf": return <>
        <Image src="/images/gc-inf/ieeeconf.png" alt="Ken Cheng presenting his traffic forecasting research at IEEE ITSC 2023" fill sizes={imageSizes} />
        <span className="artwork-photo-note">IEEE ITSC · 2023</span>
      </>;
      case "usaco": return <UsacoArtwork />;
      case "speed": return <SpeedArtwork />;
      case "cvrp": return <Image src="/media/cvrp-visualizer.png" alt="Vehicle routing problem visualizer with optimized routes" fill sizes={imageSizes} />;
    }
  }

  return (
    <div className={`project-artwork artwork-${kind}`} data-artwork={kind}>
      <div className="artwork-content">{content()}</div>
    </div>
  );
}
