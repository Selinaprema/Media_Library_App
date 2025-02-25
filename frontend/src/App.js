import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./components/LandingPage";
import HomePage from "./components/HomePage";
import Movies from "./components/Movies";
import Music from "./components/Music";
import Audiobooks from "./components/Audiobooks";
import Games from "./components/Games";
import FavouritesSection from "./components/FavouritesSection"; // Added Favourites Section
import "./styling/homepage.css"; // Import homepage styles

function App() {
  // ✅ Centralized favorites state
  const [favorites, setFavorites] = useState([]);

  // ✅ Load favorites from localStorage when the app starts
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // ✅ Function to add/remove favorites
  const toggleFavorite = (item) => {
    setFavorites((prevFavorites) => {
      const isAlreadyFavorite = prevFavorites.some(
        (fav) => fav.trackId === item.trackId
      );
      const updatedFavorites = isAlreadyFavorite
        ? prevFavorites.filter((fav) => fav.trackId !== item.trackId) // Remove if already added
        : [...prevFavorites, item]; // Add if not in favorites

      // ✅ Save updated favorites to localStorage
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  return (
    <Router>
      <div className="app">
        <Header />

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/home"
            element={
              <HomePage favorites={favorites} toggleFavorite={toggleFavorite} />
            }
          />
          <Route
            path="/movies"
            element={
              <Movies favorites={favorites} toggleFavorite={toggleFavorite} />
            }
          />
          <Route
            path="/music"
            element={
              <Music favorites={favorites} toggleFavorite={toggleFavorite} />
            }
          />
          <Route
            path="/audiobooks"
            element={
              <Audiobooks
                favorites={favorites}
                toggleFavorite={toggleFavorite}
              />
            }
          />
          <Route
            path="/games"
            element={
              <Games favorites={favorites} toggleFavorite={toggleFavorite} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
