"use client";

import { DemoPlayer } from "./DemoPlayer";

const STAGES = [
  { label: "Edit", detail: "Version a configuration change" },
  { label: "Trace", detail: "Resolve the affected dependencies" },
  { label: "Deliver", detail: "Distribute a consistent version" },
] as const;

const DEPENDENCIES = [
  { name: "Forecast inputs", detail: "Model → configuration", path: "M18 50H38Q43 50 43 45V24Q43 19 48 19H66" },
  { name: "Model settings", detail: "Configuration → model", path: "M18 50H66" },
  { name: "Planning outputs", detail: "Model → downstream", path: "M18 50H38Q43 50 43 55V76Q43 81 48 81H66" },
] as const;

function VersionDiff() {
  return (
    <div className="amz-source">
      <div className="amz-pane-label"><span>01</span> Configuration</div>
      <div className="amz-file-header">
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" aria-hidden="true"><path d="M2 1H8L12 5V15H2Z M8 1V5H12" stroke="currentColor" /></svg>
        <span>config.json</span>
        <small>JSON</small>
      </div>
      <div className="amz-code" aria-label="Illustrative JSON configuration changes the model input version from v041 to v042">
        <div><span>1</span><code>{"{"}</code></div>
        <div><span>2</span><code><b>&quot;model&quot;</b>: <em>&quot;forecast&quot;</em>,</code></div>
        <div><span>3</span><code><b>&quot;inputs&quot;</b>: {"{"}</code></div>
        <div className="amz-code-removed"><span>−</span><code><b>&quot;version&quot;</b>: <em>&quot;v041&quot;</em></code></div>
        <div className="amz-code-added"><span>+</span><code><b>&quot;version&quot;</b>: <em>&quot;v042&quot;</em></code><i aria-hidden="true" /></div>
        <div><span>5</span><code>{"}"},</code></div>
        <div><span>6</span><code><b>&quot;overrides&quot;</b>: {"{}"}</code></div>
        <div><span>7</span><code>{"}"}</code></div>
      </div>
      <div className="amz-change-summary"><span><i />1 change</span><span>Version-controlled inputs</span></div>
    </div>
  );
}

function DependencyTrace({ stage }: { stage: number }) {
  return (
    <div className="amz-trace">
      <div className="amz-pane-label"><span>02</span> Dependency trace</div>
      <div className="amz-map">
        <svg className="amz-routes" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {DEPENDENCIES.map(({ path, name }, index) => (
            <g key={name}>
              <path className="amz-route" d={path} vectorEffect="non-scaling-stroke" />
              <path className={`amz-route-progress amz-route-${index}`} d={path} vectorEffect="non-scaling-stroke" />
            </g>
          ))}
        </svg>
        <div className="amz-origin">
          <span className="amz-origin-mark" aria-hidden="true"><i /><i /><i /></span>
          <strong>v042</strong>
          <small>Config bundle</small>
        </div>
        {DEPENDENCIES.map(({ name, detail }, index) => (
          <div className={`amz-dependency amz-dependency-${index}`} key={name}>
            <i className="amz-node" aria-hidden="true" />
            <strong>{name}</strong>
            <small>{detail}</small>
          </div>
        ))}
      </div>
      <div className="amz-trace-status"><span className="amz-status-dot" />{stage === 0 ? "Change ready to trace" : stage === 1 ? "Following model and configuration links" : "Dependencies resolved"}</div>
    </div>
  );
}

function DeliveryReceipt({ stage }: { stage: number }) {
  return (
    <div className="amz-delivery">
      <div className="amz-delivery-heading">
        <div className="amz-pane-label"><span>03</span> Distribution</div>
        <p>One version across planning lanes</p>
      </div>
      <div className="amz-release-path" aria-label="Configuration distribution uses AWS Lambda, S3, and internal APIs">
        <span>Lambda</span><i aria-hidden="true" /><span>S3</span><i aria-hidden="true" /><span>Internal APIs</span>
      </div>
      <div className="amz-receipts">
        {["A", "B", "C"].map((lane, index) => (
          <div className={`amz-receipt amz-receipt-${index}`} key={lane}>
            <span className="amz-lane">Planning lane {lane}</span>
            <span className="amz-receipt-status">
              <i aria-hidden="true" />
              {stage === 2 ? "v042" : stage === 1 ? "Resolved" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AmazonDemo() {
  return (
    <DemoPlayer
      className="amazon-demo"
      label="Amazon configuration infrastructure"
      eyebrow="Amazon / Configuration Infrastructure"
      title="A change, traced end to end."
      stages={STAGES}
      note="Illustrative workflow"
      duration={3200}
    >
      {({ stage }) => (
        <div className="amz-workspace" data-stage={stage}>
          <div className="amz-workspace-bar">
            <span><i aria-hidden="true" /> Configuration workspace</span>
            <span className="amz-version-change">v041 <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true"><path d="M1 5H16M12 1L16 5L12 9" stroke="currentColor" /></svg> <strong>v042</strong></span>
          </div>
          <div className="amz-change-grid">
            <VersionDiff />
            <DependencyTrace stage={stage} />
          </div>
          <DeliveryReceipt stage={stage} />
        </div>
      )}
    </DemoPlayer>
  );
}
