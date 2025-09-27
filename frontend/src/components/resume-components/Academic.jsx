export const Academic = ({ academic }) => {
  return (
    <section className="academic-experience section" id="education">
      <h2 className="section-title">التعليم</h2>
      <div className="education__container bd-grid">
        {academic.map((academy) => (
          <Academy key={academy.institution} {...academy} />
        ))}
      </div>
    </section>
  );
};

const Academy = ({ career, date, institution, degree, grade, field_of_study, rank }) => {
  return (
    <div className="education__content">
      <div className="education__time">
        <span className="education__rounder"></span>
        <span className="education__line"></span>
      </div>
      <div className="education__data bd-grid">
  <h3 className="education__title">{career}</h3>
  <span className="education__year">{date}</span>
  <span className="education__studies">{institution}</span>
  {/* <span className="education__degree_and_field">{degree} - <strong>{field_of_study}</strong></span> */}
  {grade && <><span className="education__grade">المعدل: <strong>{grade}</strong></span></>}
  {rank && <><span className="education__rank">الترتيب: <strong>{rank}</strong></span></>}
      </div>
    </div>
  );
};
