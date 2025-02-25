import React from "react";
import { useNavigate } from "react-router-dom";
import "../styling/landingpage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay">
        <h1>Welcome to Media Library</h1>
        <button onClick={() => navigate("/home")}>Explore Media</button>
      </div>
    </div>
  );
};

export default LandingPage;
