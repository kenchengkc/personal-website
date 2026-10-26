"use client";

import Image from "next/image";
import { AmazonArtwork } from "./AmazonArtwork";
import { ModelArtwork } from "./ModelArtwork";
import { AsterArtwork, GcinfArtwork, WassersteinArtwork } from "./ResearchArtwork";
import { SpeedArtwork } from "./SpeedArtwork";
import { ProductFlowArtwork } from "./ProductFlowArtwork";
import { ProductBrowserPreview } from "./ProductBrowserPreview";
import { CvrpArtwork } from "./CvrpArtwork";

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

export function ProjectArtwork({ kind }: { kind: ArtworkKind }) {

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
    <div className={`project-artwork artwork-${kind}`} data-artwork={kind}>
      <div className="artwork-content">{content()}</div>
    </div>
  );
}
