export function Columbia() {
  const coursework = [
    "Databases",
    "Artificial Intelligence",
    "Natural Language Processing",
    "Linear Regression",
    "Linear Algebra",
    "Data Structures",
    "Probability Theory",
  ];

  return (
    <section
      className="narrative-section columbia-section"
      id="columbia"
      data-scroll-section
      data-scroll-label="COLUMBIA"
    >
      <div className="reading-column">
        <p className="section-kicker" data-reveal>Columbia</p>

        <div className="columbia-heading" data-reveal>
          <div>
            <h2>Computer Science at Columbia.</h2>
            <p>B.S. Computer Science · Statistics minor · Class of 2028</p>
          </div>
          <span>New York</span>
        </div>

        <div className="columbia-honor" data-reveal>
          <div className="honor-mark" aria-hidden="true">✦</div>
          <div>
            <span>Egleston Scholar</span>
            <strong>Top 1%</strong>
          </div>
          <p>
            Columbia Engineering scholar recognition for exceptional academic
            achievement and intellectual promise.
          </p>
        </div>

        <div className="coursework-block" data-reveal>
          <span className="coursework-label">Selected coursework</span>
          <div className="coursework-grid">
            {coursework.map((course, index) => (
              <span key={course}>
                <i>{String(index + 1).padStart(2, "0")}</i>
                {course}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
