import { useState, useEffect } from "react";

import { Profile } from "@/components/resume-components/Profile";
import { Academic } from "@/components/resume-components/Academic";
import { Skills } from "@/components/resume-components/Skills";
import { Proyects } from "@/components/resume-components/Proyects";
import { Works } from "@/components/resume-components/Works";
import { AboutMe } from "@/components/resume-components/AboutMe";
import { Menu } from "@/components/common/Menu";
import { SEO } from "@/components/common/SEO";

import { Data as dataSchema } from '@/schemas/Data';
import { Menu as menuSchema } from '@/schemas/Menu';

export const Resume = () => {
  const query = '(min-width: 968px)';
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches]);

  const { profile, aboutMe, skills, socialMedia, experience } = dataSchema;
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
            <Proyects {...experience} />
          </div>
        </div>
      </main>
    </>
  );
};
