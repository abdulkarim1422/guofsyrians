import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import "@/styles/MainLandingPage.css";

const Wave = () => {
  const [isWavesCentered, setIsWavesCentered] = useState(false);
  const navigate = useNavigate();

  const toggleWavesSize = () => {
    setIsWavesCentered((prevState) => !prevState);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleFormClick = () => {
    navigate('/form');
  };

  return (
    <div className="fullpage-container">
      <section className="hero">
        <div className={`hero__waves ${isWavesCentered ? 'is-centered' : ''}`} />
        <div className="hero__content">
          <h1 className="hero__title">الاتّحاد العام لطلبة سوريا</h1>
          <div className="hero__buttons">
            <button className="hero__button hero__button--primary" onClick={handleLoginClick}>
              تسجيل الدخول
            </button>
            <button className="hero__button hero__button--secondary" onClick={handleFormClick}>
              ملء النموذج
            </button>
            <button className="hero__button hero__button--toggle" onClick={toggleWavesSize}>
              تبديل الأمواج
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export { Wave };