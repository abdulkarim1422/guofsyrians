import { useState, useEffect } from "react";

import { Profile } from "../components_renamed/Profile";
import { Academic } from "../components_renamed/Academic";
import { Skills } from "../components_renamed/Skills";
import { Proyects } from "../components_renamed/Proyects";
import { Works } from "../components_renamed/Works";
import { AboutMe } from "../components_renamed/AboutMe";
import { Menu } from "../components_renamed/Menu";
import { SEO } from "../components_renamed/SEO";

import { Data as dataSchema } from '../schemas/Data';
import { Menu as menuSchema } from '../schemas/Menu';

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
