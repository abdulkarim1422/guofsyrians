import { Description } from "./Description";

export const Projects = ({ projects }) => {
  return (
    <section className="projects-experience section mb-4" id="projects">
      <h2 className="section-title">Projects</h2>
      <div className="experience__container bd-grid">
        {projects.map((project) => (
          <Project key={project.company} {...project} />
        ))}
      </div>
    </section>
  );
};

const Project = ({ name, company, period, description, role, project_type, start_date, end_date, tools, outcomes, responsibilities }) => {
  return (
    <div className="experience__content">
      <div className="experience__time">
        <span className="experience__rounder"></span>
        <span className="experience__line"></span>
      </div>
      <div className="experience__data bd-grid">
        <h3 className="experience__title">
          {name} - {company}
        </h3>
        {period != "Period not specified" && <span>{period}</span>}
        <div className="experience__details">
          <p><strong>Role:</strong> {role}</p>
          <p><strong>Project Type:</strong> {project_type}</p>
          <p><strong>Tools:</strong> {tools}</p>
          <p><strong>Outcomes:</strong> {outcomes}</p>
          <p><strong>Responsibilities:</strong> {responsibilities}</p>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};
