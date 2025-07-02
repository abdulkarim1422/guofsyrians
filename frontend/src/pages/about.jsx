import React, { useEffect, useState } from 'react';
import '@/styles/dashboard.css';

const developers = [
  {
    name: 'Abdulkarim Lahmuni',
    role: 'Lead Developer',
    email: 'abdulkarim1422.18@gmail.com',
    github: 'https://github.com/abdulkarim1422',
    description: 'Doctor & Programmer'
  },
  {
    name: 'Mamdouh Almasri',
    role: 'Frontend Developer',
    email: 'firas.syrians@example.com',
    github: 'https://github.com/mamdouhal',
    description: 'Software Engineer Student'
  },
];

const PROJECT_GITHUB = 'https://github.com/abdulkarim1422/guofsyrians';

function ProjectCard() {
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.github.com/repos/abdulkarim1422/guofsyrians')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch repo');
        return res.json();
      })
      .then((data) => {
        setRepo(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center mb-8 w-full max-w-2xl">
      <div className="flex items-center mb-2">
        <svg className="w-7 h-7 mr-2 text-gray-800" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" />
        </svg>
        <a href={PROJECT_GITHUB} target="_blank" rel="noopener noreferrer" className="text-lg font-bold text-gray-800 hover:underline">
          guofsyrians (GitHub)
        </a>
      </div>
      {loading && <div className="text-gray-500 text-sm">Loading project info...</div>}
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {repo && (
        <>
          <div className="text-gray-700 text-center mb-2">{repo.description}</div>
          <div className="flex space-x-4 text-sm text-gray-600">
            <div>⭐ {repo.stargazers_count} stars</div>
            <div>🍴 {repo.forks_count} forks</div>
            <div>📝 {repo.open_issues_count} issues</div>
            <div>🔄 Last push: {new Date(repo.pushed_at).toLocaleDateString()}</div>
          </div>
        </>
      )}
    </div>
  );
}

const About = () => (
  <div className="about-page-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
    <ProjectCard />
    <h1 className="text-3xl font-bold mb-6 text-brand">About the Developers</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
      {developers.map((dev, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-2xl font-bold">{dev.name.charAt(0)}</span>
          </div>
          <h2 className="text-xl font-semibold mb-1">{dev.name}</h2>
          <div className="text-gray-500 mb-2">{dev.role}</div>
          <div className="text-gray-700 text-center mb-2">{dev.description}</div>
          <div className="flex space-x-4 mt-2">
            <a href={`mailto:${dev.email}`} className="text-blue-600 hover:underline text-sm">{dev.email}</a>
            <a href={dev.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-black text-sm flex items-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.396.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .268.18.579.688.481C19.138 20.2 22 16.448 22 12.021 22 6.484 17.523 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-8 text-gray-400 text-xs">&copy; {new Date().getFullYear()} guofyrians. All rights reserved.</div>
  </div>
);

export default About;
