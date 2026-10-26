import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import asterSummary from "@/public/media/research/aster-summary.json";

export function WassersteinArtwork() {
  return (
    <figure className="research-result research-result-wasserstein" aria-label="Wasserstein Regimes published research results">
      <figcaption>
        <span className="research-result-context">Cross-asset results</span>
        <h3>Regime structure and stability</h3>
      </figcaption>
      <a
        className="research-figure-link"
        href="/media/research/wasserstein-cross-asset-comparison.png"
        target="_blank"
        rel="noreferrer"
        aria-label="Open the full-size Wasserstein cross-asset results figure"
      >
        <Image
          src="/media/research/wasserstein-cross-asset-comparison.png"
          alt="Published comparison for QQQ, TLT, GLD, and HYG: scale dominates raw-regime separation, while shape-only stability varies across assets."
          width={1800}
          height={720}
          sizes="(max-width: 700px) calc(100vw - 80px), 440px"
        />
        <span>Open figure <ArrowUpRight size={13} aria-hidden="true" /></span>
      </a>
      <p className="research-result-finding">Scale dominated raw-regime differences; shape-only stability varied across assets.</p>
      <p className="research-result-note"><strong>Forecasting study:</strong> 600 five-session forecasts showed no advantage over four simpler baselines.</p>
    </figure>
  );
}

export function AsterArtwork() {
  const fullBudget = asterSummary.full_budget.search_replications;
  const race = asterSummary.race.search_replications;
  const reduction = (100 * (1 - race / fullBudget)).toFixed(1);

  return (
    <figure className="research-result research-result-aster" aria-label="Aster saved experiment: same selected candidate with 72 rather than 432 search evaluations">
      <figcaption>
        <span className="research-result-context">One synthetic experiment · Seed 17</span>
        <h3>Same selected candidate</h3>
      </figcaption>
      <p className="research-result-lead"><strong>{reduction}%</strong><span>fewer search evaluations</span></p>
      <div className="research-comparison" role="img" aria-label={`Search evaluations: full budget ${fullBudget}; Aster ${race}. Both selected the same candidate from 16 configurations.`}>
        {[{ label: "Full budget", value: fullBudget }, { label: "Aster", value: race }].map(({ label, value }) => (
          <div className="research-comparison-row" key={label}>
            <div><span>{label}</span><strong>{value}</strong></div>
            <div className="research-comparison-track"><span className="research-comparison-fill" style={{ width: `${100 * value / fullBudget}%` }} /></div>
          </div>
        ))}
      </div>
      <p className="research-result-finding">16 configurations · Noisy-quadratic objective</p>
      <p className="research-result-note">Search totals exclude 100 independent audit evaluations per selected candidate.</p>
    </figure>
  );
}
