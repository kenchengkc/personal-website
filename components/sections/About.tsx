export function About() {
  return (
    <section className="intro-strip" aria-label="About Ken">
      <p className="intro-index" data-reveal>01 / approach</p>
      <p className="intro-statement" data-reveal>
        I like work where the model cannot be separated from the system around it.
        Data quality, latency, interfaces, and correctness all count.
      </p>
      <dl data-reveal>
        <div>
          <dt>Core</dt>
          <dd>Python, C++</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>ML, systems, quant</dd>
        </div>
        <div>
          <dt>Based</dt>
          <dd>New York</dd>
        </div>
      </dl>
    </section>
  );
}
