import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignupSignInPopup from './SignUpSignInPopup';
import '../App.css';

const OnboardingPage = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate hook

  const handleGetStartedClick = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    // Redirect to the dashboard page after signing in
    navigate('/onboarding');
  };

  return (
    <div>
      <header>
        <h1 className="header-title">Rentora</h1>
      </header>
      <Link to="#" className="get-started-btn" onClick={handleGetStartedClick}>
        Get Started
      </Link>
      {isPopupOpen && <SignupSignInPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default OnboardingPage;
