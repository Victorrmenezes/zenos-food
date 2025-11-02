import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import LateralNavBar from '../components/LateralNavBar';
import Footer from '../components/Footer';
import './BasePage.css';

function BasePage({ children }) {
  const [isNavVisible, setIsNavVisible] = useState(false);

  const toggleNav = () => {
    setIsNavVisible(!isNavVisible);
  };

  return (
    <div className={`base-page ${isNavVisible ? 'nav-visible' : ''}`}>
      <LateralNavBar isVisible={isNavVisible} />
      <div className={`content-wrapper ${isNavVisible ? 'shifted' : ''}`}>
        <NavBar onToggleNav={toggleNav} isNavVisible={isNavVisible} />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default BasePage;
