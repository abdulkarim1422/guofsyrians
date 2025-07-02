import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "@/utils/api.js";

import { Profile } from "@/components/resume-components/Profile";
import { Academic } from "@/components/resume-components/Academic";
import { Skills } from "@/components/resume-components/Skills";
import { Projects } from "@/components/resume-components/Projects";
import { Works } from "@/components/resume-components/Works";
import { AboutMe } from "@/components/resume-components/AboutMe";
import { Menu } from "@/components/common/Menu";
import { SEO } from "@/components/common/SEO";
import { getMemberImageUrl } from "@/utils/imageUtils";

import { Data as dataSchema } from '@/schemas/Data';
import { Menu as menuSchema } from '@/schemas/Menu';

import "@/styles/resume.css";

export const Resume = () => {
  const { memberId } = useParams();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const query = '(min-width: 968px)';
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches]);

  // Fetch member data
  useEffect(() => {
    const fetchMemberData = async () => {
      if (!memberId) {
        setError("Member ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/api/resume/${memberId}`);
        setMemberData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching member data:", err);
        setError(err.response?.data?.detail || err.message || "Failed to fetch member data");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [memberId]);

  // Transform member data to match existing schema
  const transformMemberData = (data) => {
    if (!data || !data.member) return dataSchema;

    const { member, work_experiences = [], education = [], projects = [] } = data;

    return {
      profile: {
        name: member.name || "Unknown Name",
        ocupation: member.professional_title || "Professional",
        location: member.city && member.country ? `${member.city}, ${member.country}` : (member.city || member.country || "Location"),
        email: member.email || "",
        telephone: member.phone || "",
        image: getMemberImageUrl(member.image, member.sex),
      },
      aboutMe: {
        label: "About Me",
        description: member.bio || "Professional with diverse experience and skills.",
      },
      skills: {
        technicalLabel: "Technical Skills",
        softLabel: "Skills",
        technicalSkills: member.skills || [],
        softSkills: member.interests || [],
      },
      socialMedia: {
        label: "SOCIAL",
        social: [
          ...(member.social_media?.linkedin ? [{
            label: `Visit ${member.name}'s LinkedIn profile`,
            name: "linkedin",
            url: `https://linkedin.com/in/${member.social_media.linkedin}`,
            className: "bxl-linkedin-square",
          }] : []),
          ...(member.social_media?.github ? [{
            label: `Visit ${member.name}'s GitHub profile`,
            name: "github", 
            url: `https://github.com/${member.social_media.github}`,
            className: "bxl-github",
          }] : []),
        ],
      },
      experience: {
        works: work_experiences.map(work => ({
          title: work.job_title || "Position",
          period: work.start_date && work.end_date ? 
            `${new Date(work.start_date).toLocaleDateString()} - ${new Date(work.end_date).toLocaleDateString()}` :
            work.start_date ? `${new Date(work.start_date).toLocaleDateString()} - Present` : "Period not specified",
          company: work.company || "Company",
          description: work.description ? [work.description] : [],
        })),
        academic: education.map(edu => ({
          career: `${edu.degree || "Degree"} in ${edu.field_of_study || "Field of Study"}`,
          date: edu.end_date ? new Date(edu.end_date).getFullYear().toString() : "Year not specified",
          institution: edu.institution || "Institution",
        })),
        projects: projects.map(project => ({
          name: project.project_name || "Project",
          company: member.name || "Personal",
          period: project.start_date && project.end_date ? 
            `${new Date(project.start_date).toLocaleDateString()} - ${new Date(project.end_date).toLocaleDateString()}` :
            project.start_date ? `${new Date(project.start_date).toLocaleDateString()} - Present` : "Period not specified",
          description: project.description ? [project.description] : [],
        })),
      },
    };
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const transformedData = transformMemberData(memberData);
  const { profile, aboutMe, skills, socialMedia, experience } = transformedData;
  return (
    <>
      <SEO  {...profile} {...aboutMe} />
      {!matches && <Menu {...menuSchema} />}
      <main className='l-main bd-container' id='bd-container'>
        <div className='resume' id='area-cv'>
          <div className='resume__left'>
            <Profile {...profile} {...socialMedia} isMobileView={!matches} />
            <AboutMe {...aboutMe} />
            <Skills {...skills} />
          </div>
          <div className='resume__right'>
            <Works {...experience} />
            <Academic {...experience} />
            <Projects {...experience} />
          </div>
        </div>
      </main>
    </>
  );
};
