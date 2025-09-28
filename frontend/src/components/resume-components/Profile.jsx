import { BoxIcon } from '@/components/common/BoxIcon';
import { Options } from "@/components/common/Options";
import { getDefaultAvatarPath } from "@/utils/imageUtils";

export const Profile = ({
  name,
  ocupation,
  location,
  email,
  telephone,
  image,
  social,
  languages,
  isMobileView,
}) => {
  console.log({ isMobileView })
  return (
    <section className="home section" id="home">
      <Options />
      <div className="home__container bd-grid">
        <div className="home__container bd-grid">
          <div className="home__data bd-grid">
            <img
              src={image}
              alt="صورة الملف الشخصي"
              className="home__img no-print"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getDefaultAvatarPath("male");
              }}
            />
            <h1 className="home__title">{name}</h1>
            <h3 className="home__profession">{ocupation}</h3>
            <span className="home__information no-print">
              <i className="bx bx-map home__icon" /> {location ? `الموقع: ${location}` : "الموقع غير محدد"}
            </span>
            <span className="home__information no-print">
              <i className="bx bx-envelope home__icon" /> {email ? `البريد الإلكتروني: ${email}` : "البريد الإلكتروني غير محدد"}
            </span>
            <span className="home__information no-print">
              <i className="bx bx-phone home__icon" /> {telephone ? `الهاتف: ${telephone}` : "الهاتف غير محدد"}
            </span>
            <span className="home__information no-print">
              <i className="bx bx-globe home__icon" /> {languages && languages.length ? `اللغات: ${languages.join(", ")}` : "اللغات غير محددة"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
