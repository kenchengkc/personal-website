export function About() {
  return (
    <section className="intro-strip" aria-label="About Ken">
      <p className="section-number" data-reveal>01</p>
      <p className="intro-statement" data-reveal>
        I care about the whole system around a model: the data, interfaces,
        reliability, and the decisions it supports.
      </p>
      <dl data-reveal>
        <div><dt>Core</dt><dd>Python, C++</dd></div>
        <div><dt>Focus</dt><dd>ML, systems, quant</dd></div>
        <div><dt>Based</dt><dd>New York</dd></div>
      </dl>
    </section>
  );
}
