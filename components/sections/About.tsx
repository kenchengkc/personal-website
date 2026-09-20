export function About() {
  return (
    <section className="intro-strip" aria-label="About Ken">
      <p data-reveal>
        Engineer first. I like problems where <strong>models</strong>,{" "}
        <strong>data</strong>, and <strong>infrastructure</strong> all have to
        agree.
      </p>

      <dl data-reveal>
        <div>
          <dt>Core</dt>
          <dd>Python + C++</dd>
        </div>
        <div>
          <dt>Focus</dt>
          <dd>ML + systems + quant</dd>
        </div>
        <div>
          <dt>Next</dt>
          <dd>Summer 2027</dd>
        </div>
      </dl>
    </section>
  );
}
