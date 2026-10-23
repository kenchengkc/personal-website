export function Columbia() {
  const coursework = [
    ["Machine Learning", "Natural Language Processing", "Artificial Intelligence"],
    ["Advanced Programming in C", "Data Structures and Algorithms", "Databases"],
    ["Probability Theory", "Statistical Inference", "Linear Algebra", "Linear Regression"],
  ];

  return (
    <section
      className="narrative-section columbia-section"
      id="columbia"
      data-scroll-section
      data-scroll-label="COLUMBIA"
    >
      <div className="reading-column">
        <div className="columbia-heading" data-reveal>
          <div>
            <h2>Columbia University</h2>
            <p>B.S. Computer Science · Statistics Minor</p>
            <p>GPA 3.8 · Expected May 2028</p>
          </div>
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
          <h3 className="coursework-label">Selected coursework</h3>
          <div className="coursework-list">
            {coursework.map(courses => (
              <p key={courses[0]}>{courses.join(", ")}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
