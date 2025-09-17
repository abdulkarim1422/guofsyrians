// C:\Users\abodi\OneDrive\Desktop\guofsyrians-main\frontend\src\pages\Resume.jsx
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

import { Data as dataSchema } from "@/schemas/Data";
import { Menu as menuSchema } from "@/schemas/Menu";

import "@/styles/resume.css";

export const Resume = () => {
  const { memberId } = useParams();
  const [memberData, setMemberData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = "(min-width: 968px)";
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  // راقب حجم الشاشة (بدون إعادة إنشاء غير لازمة)
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  // جلب بيانات السيرة
  useEffect(() => {
    const fetchMemberData = async () => {
      if (!memberId) {
        setError("Member ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // ⚠️ بدون /api في البداية — الـ baseURL يضيفها تلقائيًا
        const { data } = await api.get(`/resume/${memberId}`);
        setMemberData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching member data:", err);
        const msg =
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to fetch member data";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [memberId]);

  // تحويل شكل البيانات ليتوافق مع مكوّنات الواجهة
  const transformMemberData = (data) => {
    if (!data || !data.member) return dataSchema;

    const { member, work_experiences = [], education = [], projects = [] } = data;

    return {
      profile: {
        name: member.name || "Unknown Name",
        ocupation: member.professional_title || "Professional",
        location:
          member.city && member.country
            ? `${member.city}, ${member.country}`
            : member.city || member.country || "Location",
        email: member.email || "",
        telephone: member.phone || "",
        image: getMemberImageUrl(member.image, member.sex),
      },
      aboutMe: {
        label: "About Me",
        description: member.bio || "Professional with diverse experience and skills.",
      },
      skills: {
        skillsLabel: "Skills",
        interestsLabel: "Interests",
        storedSkills: member.skills || [],
        storedInterests: member.interests || [],
      },
      socialMedia: {
        label: "SOCIAL",
        social: (() => {
          const socialMediaIconMap = {
            linkedin: "bxl-linkedin-square",
            github: "bxl-github",
            gitlab: "bxl-gitlab",
            behance: "bxl-behance",
            dribbble: "bxl-dribbble",
            "stack overflow": "bxl-stack-overflow",
            angellist: "bx-briefcase",
            xing: "bx-network-chart",
            facebook: "bxl-facebook-square",
            "twitter/x": "bxl-twitter",
            twitter: "bxl-twitter",
            x: "bxl-twitter",
            instagram: "bxl-instagram",
            youtube: "bxl-youtube",
            tiktok: "bxl-tiktok",
            snapchat: "bxl-snapchat",
            pinterest: "bxl-pinterest",
            reddit: "bxl-reddit",
            discord: "bxl-discord",
            telegram: "bxl-telegram",
            whatsapp: "bxl-whatsapp",
            signal: "bx-message-dots",
            clubhouse: "bx-microphone",
            threads: "bx-message-square-dots",
            "portfolio website": "bx-globe",
            "personal website": "bx-globe",
            blog: "bx-edit",
            medium: "bxl-medium",
            "dev.to": "bx-code-alt",
            hashnode: "bx-hash",
            substack: "bx-news",
            figma: "bxl-figma",
            "adobe portfolio": "bx-palette",
            canva: "bx-paint",
            unsplash: "bx-camera",
            flickr: "bxl-flickr",
            deviantart: "bx-brush",
            artstation: "bx-brush-alt",
            sketch: "bx-pencil",
            twitch: "bxl-twitch",
            vimeo: "bxl-vimeo",
            "youtube gaming": "bxl-youtube",
            dailymotion: "bx-video",
            rumble: "bx-video-recording",
            spotify: "bxl-spotify",
            soundcloud: "bxl-soundcloud",
            bandcamp: "bx-music",
            "apple music": "bx-music",
            "youtube music": "bxl-youtube",
            podcast: "bx-podcast",
            shopify: "bxl-shopify",
            etsy: "bx-store",
            "amazon store": "bx-store-alt",
            ebay: "bx-shopping-bag",
            fiverr: "bx-briefcase-alt",
            upwork: "bx-briefcase-alt-2",
            freelancer: "bx-user-check",
            wechat: "bx-chat",
            weibo: "bx-chat",
            line: "bx-message",
            kakaotalk: "bx-message-square",
            vkontakte: "bx-group",
            odnoklassniki: "bx-group",
            qq: "bx-chat",
            mastodon: "bx-share-alt",
            bluesky: "bx-cloud",
            nostr: "bx-network-chart",
            "lens protocol": "bx-camera-movie",
            mirror: "bx-reflect-horizontal",
            glass: "bx-glasses",
          };

          const socialLinks = [];
          if (member.social_media && typeof member.social_media === "object") {
            Object.entries(member.social_media).forEach(([platform, url]) => {
              if (url && url.trim()) {
                const platformLower = platform.toLowerCase();
                const iconClass = socialMediaIconMap[platformLower] || "bx-link";
                socialLinks.push({
                  label: `Visit ${member.name}'s ${platform} profile`,
                  name: platformLower,
                  url,
                  className: iconClass,
                });
              }
            });
          }
          return socialLinks;
        })(),
      },
      experience: {
        works: work_experiences.map((work) => ({
          title: work.job_title || "Position",
          period:
            work.start_date && work.end_date
              ? `${new Date(work.start_date).toLocaleDateString()} - ${new Date(
                  work.end_date
                ).toLocaleDateString()}`
              : work.start_date
              ? `${new Date(work.start_date).toLocaleDateString()} - Present`
              : "Period not specified",
          company: work.company || "Company",
          achievements: work.achievements || [],
          responsibilities: work.responsibilities || [],
          description: work.description ? [work.description] : [],
        })),
        academic: education.map((edu) => ({
          career: `${edu.degree || "Degree"} in ${
            edu.field_of_study || "Field of Study"
          }`,
          date: edu.end_date
            ? new Date(edu.end_date).getFullYear().toString()
            : "Year not specified",
          institution: edu.institution || "Institution",
          degree: edu.degree || "Degree",
          field_of_study: edu.field_of_study || "Field of Study",
          grade: edu.grade || "",
          rank: edu.rank || "",
        })),
        projects: projects.map((project) => ({
          name: project.project_name || "Project",
          company: member.name || "Personal",
          role: project.role || "Role",
          period:
            project.start_date && project.end_date
              ? `${new Date(project.start_date).toLocaleDateString()} - ${new Date(
                  project.end_date
                ).toLocaleDateString()}`
              : project.start_date
              ? `${new Date(project.start_date).toLocaleDateString()} - Present`
              : "Period not specified",
          responsibilities: project.responsibilities || [],
          outcomes: project.outcomes || [],
          description: project.description ? [project.description] : [],
        })),
      },
    };
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column" }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  const transformedData = transformMemberData(memberData);
  const { profile, aboutMe, skills, socialMedia, experience } = transformedData;

  return (
    <>
      <SEO {...profile} {...aboutMe} />
      {!matches && <Menu {...menuSchema} />}
      <main className="l-main bd-container" id="bd-container">
        <div className="resume" id="area-cv">
          <div className="resume__left">
            <Profile {...profile} {...socialMedia} isMobileView={!matches} />
            <AboutMe {...aboutMe} />
            <Skills {...skills} />
          </div>
          <div className="resume__right">
            <Works {...experience} />
            <Academic {...experience} />
            <Projects {...experience} />
          </div>
        </div>
      </main>
    </>
  );
};
