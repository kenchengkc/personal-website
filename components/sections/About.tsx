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
          Undergraduate deep learning researcher at Columbia’s Creative Machines
          Lab, studying deceptive communication in LLMs. Founder and lead engineer
          of Quantiv, and builder of FDRE. Previously an SDE intern at Amazon SCOT.
        </p>

        <dl className="profile-facts" data-reveal>
          <div><dt>Core</dt><dd>Python, C++</dd></div>
          <div><dt>Focus</dt><dd>LLM evaluation, forecasting, retrieval</dd></div>
          <div><dt>Signal</dt><dd>IEEE published · USACO Platinum</dd></div>
          <div><dt>Degree</dt><dd>Columbia CS · Expected May 2028</dd></div>
        </dl>
      </div>
    </section>
  );
}
