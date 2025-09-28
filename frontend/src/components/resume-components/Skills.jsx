export const Skills = ({
  skillsLabel,
  interestsLabel,
  storedSkills,
  storedInterests,
}) => {
  return (
    <>
      <section className="technical-skills section" id="skills">
        <h2 className="section-title">{skillsLabel || "المهارات"}</h2>
        <div className="skills__content bd-grid">
          <ul className="skills__data">
            {storedSkills.map((skill) => <Skill key={skill} skill={skill} />)}
          </ul>
        </div>
      </section>
      <section className="soft-skills section">
        <h2 className="section-title">{interestsLabel || "الاهتمامات"}</h2>
        <div className="skills__content bd-grid">
          <ul className="skills__data">
            {storedInterests.map((skill) => <Skill key={skill} skill={skill} />)}
          </ul>
        </div>
      </section>
    </>
  );
};

const Skill = ({ skill }) => (
  <li className="skills__name">
    <span className="skills__circle" /> {skill}
  </li>
);
