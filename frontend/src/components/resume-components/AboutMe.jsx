export const AboutMe = ({ label, description }) => (
  <section className="profile section" id="profile">
  <h2 className="section-title">{label || "نبذة عني"}</h2>
  <p className="profile__description">{description || "لا توجد نبذة متوفرة."}</p>
  </section>
);
