import type { FeaturedProject } from "@/data/portfolio";

type DemoKind = FeaturedProject["demo"];

function DemoChrome({
  label,
  status,
}: {
  label: string;
  status: string;
}) {
  return (
    <div className="demo-chrome">
      <span>{label}</span>
      <span className="demo-chrome-status">{status}</span>
    </div>
  );
}

function AmazonDemo() {
  const services = ["MOSAIC", "Demand", "Revenue", "Inventory", "BIE", "Research"];

  return (
    <div className="demo demo-amazon" aria-label="Animated Amazon configuration system diagram">
      <DemoChrome label="SCOT / config" status="published" />
      <div className="amazon-stage">
        <div className="amazon-core">
          <span className="demo-kicker">single source of truth</span>
          <strong>Config v42</strong>
          <small>validated · versioned · shared</small>
          <i className="amazon-core-pulse" aria-hidden="true" />
        </div>

        <div className="amazon-orbit" aria-hidden="true" />

        {services.map((service, index) => (
          <div
            className={`amazon-node amazon-node-${index + 1}`}
            key={service}
          >
            <span>{service}</span>
            <i aria-hidden="true" />
          </div>
        ))}

        <div className="amazon-flow amazon-flow-a" aria-hidden="true" />
        <div className="amazon-flow amazon-flow-b" aria-hidden="true" />
        <div className="amazon-flow amazon-flow-c" aria-hidden="true" />
        <div className="amazon-flow amazon-flow-d" aria-hidden="true" />
      </div>
      <div className="demo-footer">
        <span>17 packages + services</span>
        <span>13 engineers</span>
      </div>
    </div>
  );
}

function QuantivDemo() {
  return (
    <div className="demo demo-quantiv" aria-label="Animated Quantiv earnings forecast display">
      <DemoChrome label="Quantiv / earnings" status="live" />

      <div className="quantiv-head">
        <div>
          <span className="demo-kicker">NVDA · after close</span>
          <strong>$184.22</strong>
        </div>
        <div className="quantiv-move">
          <span>Expected move</span>
          <strong>± 7.8%</strong>
        </div>
      </div>

      <div className="quantiv-chart">
        <div className="quantiv-range">
          <span>$169.85</span>
          <i />
          <span>$198.59</span>
        </div>
        <svg viewBox="0 0 520 220" role="img" aria-label="Animated price series into earnings">
          <path
            className="quantiv-grid"
            d="M0 55H520 M0 110H520 M0 165H520"
          />
          <path
            className="quantiv-line"
            d="M0 155 C32 145 43 166 70 151 S118 130 142 137 S187 117 211 126 S256 96 281 108 S326 89 347 97 S386 73 409 86 S454 58 520 67"
          />
          <path className="quantiv-event" d="M430 18V202" />
          <circle className="quantiv-dot" cx="430" cy="78" r="5" />
        </svg>
        <span className="quantiv-event-label">earnings</span>
      </div>

      <div className="quantiv-models">
        <span><i /> ML forecast <b>7.2%</b></span>
        <span><i /> IV forecast <b>7.8%</b></span>
        <span><i /> historical <b>6.4%</b></span>
      </div>
    </div>
  );
}

function FdreDemo() {
  return (
    <div className="demo demo-fdre" aria-label="Animated SEC retrieval and citation verification flow">
      <DemoChrome label="FDRE / research" status="verified" />

      <div className="fdre-query">
        <span className="demo-kicker">research query</span>
        <p>How did META describe 2026 capex expectations?</p>
        <i className="fdre-cursor" aria-hidden="true" />
      </div>

      <div className="fdre-pipeline">
        <span>resolve issuer</span>
        <i />
        <span>retrieve</span>
        <i />
        <span>rerank</span>
        <i />
        <span>verify</span>
      </div>

      <div className="fdre-results">
        <article>
          <div>
            <b>10-Q · META</b>
            <span>2026-07-30</span>
          </div>
          <p>
            We expect capital expenditures to be approximately
            <mark> $66-72 billion </mark>
            as infrastructure investment increases.
          </p>
          <small>[1] p. 38 · confidence 0.96</small>
        </article>
        <article>
          <div>
            <b>10-Q · META</b>
            <span>2026-04-30</span>
          </div>
          <p>Prior guidance and infrastructure commentary retrieved as supporting context.</p>
          <small>[2] p. 41 · confidence 0.91</small>
        </article>
      </div>
    </div>
  );
}

function EmbersDemo() {
  return (
    <div className="demo demo-embers" aria-label="Animated Embers computer vision inventory scan">
      <DemoChrome label="Embers / room scan" status="detecting" />

      <div className="embers-view">
        <div className="embers-room" aria-hidden="true">
          <span className="room-floor" />
          <span className="room-table" />
          <span className="room-sofa" />
          <span className="room-screen" />
        </div>

        <div className="embers-scanline" aria-hidden="true" />
        <div className="embers-box embers-box-sofa">
          <span>sofa</span>
          <b>98%</b>
        </div>
        <div className="embers-box embers-box-laptop">
          <span>laptop</span>
          <b>96%</b>
        </div>
        <div className="embers-box embers-box-monitor">
          <span>monitor</span>
          <b>94%</b>
        </div>

        <div className="embers-hud">
          <span>03 objects</span>
          <strong>$4,381</strong>
          <small>estimated replacement value</small>
        </div>
      </div>

      <div className="demo-footer">
        <span>YOLOv11</span>
        <span>Gemini valuation</span>
        <span>claims ready</span>
      </div>
    </div>
  );
}

export function ProjectDemo({ kind }: { kind: DemoKind }) {
  switch (kind) {
    case "amazon":
      return <AmazonDemo />;
    case "quantiv":
      return <QuantivDemo />;
    case "fdre":
      return <FdreDemo />;
    case "embers":
      return <EmbersDemo />;
  }
}
