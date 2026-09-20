export function About() {
  return (
    <section
      className="narrative-section about-section"
      aria-label="About Ken"
      data-scroll-section
      data-scroll-label="PROFILE"
    >
      <div className="reading-column">
        <p className="section-kicker" data-reveal>Profile</p>
        <p className="narrative-lead" data-reveal>
          Previously at Amazon SCOT. Building Quantiv and FDRE. I care about
          the whole system around a model: data quality, interfaces,
          reliability, latency, and the decision it supports.
        </p>

        <dl className="profile-facts" data-reveal>
          <div><dt>Core</dt><dd>Python, C++</dd></div>
          <div><dt>Focus</dt><dd>ML, systems, quant</dd></div>
          <div><dt>Signal</dt><dd>IEEE published · USACO Platinum</dd></div>
          <div><dt>Next</dt><dd>Summer 2027</dd></div>
        </dl>
      </div>
    </section>
  );
}
