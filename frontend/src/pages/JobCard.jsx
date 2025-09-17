import { Link } from "react-router-dom";
export default function JobCard({ job }) {
  return (
    <div className="card">
      <h3>{job.title}</h3>
      <p>{job.company} • {job.location} • {job.type}</p>
      <Link to={`/jobs/${job.id}`}>التفاصيل</Link>
    </div>
  );
}
