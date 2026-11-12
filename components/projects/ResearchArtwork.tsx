import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import asterSummary from "@/public/media/research/aster-summary.json";
import { ArtworkWindow } from "./ArtworkWindow";

function FigureWindow({ name, title, label, children }: { name: string; title: string; label: string; children: ReactNode }) {
  return (
    <ArtworkWindow name={name} title={title}>
      <figure className="research-result" aria-label={label}>{children}</figure>
    </ArtworkWindow>
  );
}

function OriginalFigure({ src, alt, width, height, label }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
}) {
  return (
    <a className="research-figure-link" href={src} target="_blank" rel="noreferrer" aria-label={`Open the full-size ${label}`}>
      <Image src={src} alt={alt} width={width} height={height} unoptimized sizes="(max-width: 700px) calc(100vw - 80px), 480px" />
      <span>Open original figure <ArrowUpRight size={13} aria-hidden="true" /></span>
    </a>
  );
}

export function WassersteinArtwork() {
  return (
    <FigureWindow name="Wasserstein Regimes" title="Wasserstein · Results" label="Wasserstein Regimes published research results">
      <OriginalFigure
        src="/media/research/wasserstein-cross-asset-comparison.png"
        alt="Published comparison for QQQ, TLT, GLD, and HYG: scale dominates raw-regime separation, while shape-only stability varies across assets."
        width={1800} height={720} label="Wasserstein cross-asset results figure"
      />
      <figcaption>
        <p className="research-result-finding">Scale dominated raw-regime differences; shape-only stability varied across assets.</p>
        <p className="research-result-note"><strong>Forecasting study:</strong> 600 five-session forecasts showed no advantage over four simpler baselines.</p>
      </figcaption>
    </FigureWindow>
  );
}

export function AsterArtwork() {
  const fullBudget = asterSummary.full_budget.search_replications;
  const race = asterSummary.race.search_replications;

  return (
    <FigureWindow name="Aster" title="Aster · Experiment" label="Aster saved experiment: same selected candidate with 72 rather than 432 search evaluations">
      <div className="research-original-plots">
        <div>
          <h3>Full budget <span>{fullBudget} evaluations</span></h3>
          <OriginalFigure
            src="/media/research/aster-full-budget.svg"
            alt="Original full-budget allocation: all 16 candidates receive 27 evaluations, totaling 432."
            width={392} height={308} label="Aster full-budget allocation diagram"
          />
        </div>
        <div>
          <h3>Replication race <span>{race} evaluations</span></h3>
          <OriginalFigure
            src="/media/research/aster-replication-race.svg"
            alt="Original replication-race allocation: candidate 00 receives 27 evaluations; the other 15 candidates receive 3 each, totaling 72."
            width={392} height={308} label="Aster replication-race allocation diagram"
          />
        </div>
      </div>
      <figcaption>
        <p className="research-result-finding"><strong>Same selected candidate.</strong> Each filled square is one search evaluation. One synthetic experiment, seed 17; 16 configurations.</p>
        <p className="research-result-note">Search totals exclude 100 independent audit evaluations per selected candidate.</p>
      </figcaption>
    </FigureWindow>
  );
}

export function GcinfArtwork() {
  return (
    <FigureWindow name="GC-INF" title="GC-INF · Architecture" label="GC-INF original published model architecture">
      <OriginalFigure
        src="/media/research/gcinf-model-architecture.png"
        alt="Original GC-INF architecture: adjacency and time-indexed augmented matrices feed graph convolutional networks and Informer layers to produce traffic predictions."
        width={816} height={528} label="GC-INF model architecture figure"
      />
      <figcaption><p className="research-result-finding">Figure 5. GC-INF model architecture, IEEE ITSC 2023.</p></figcaption>
    </FigureWindow>
  );
}
