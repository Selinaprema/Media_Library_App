import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios to make HTTP requests
import "../styling/music.css";

const Music = ({ favorites, toggleFavorite }) => {
  const [music, setMusic] = useState([]); // State to store the music data
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term entered by the user

  // Fetch guest token and save it to localStorage
  const fetchToken = async () => {
    try {
      // Make an API request to generate a guest token
      const response = await axios.post("http://localhost:5000/api/token");
      const token = response.data.token;
      // Store the token in localStorage for later use
      localStorage.setItem("token", token);
    } catch (error) {
      // Handle error if token generation fails
      console.error("Error generating token:", error);
    }
  };

  // Fetch music based on the search query
  const fetchMusic = async (query) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token is found, display an error and return
      console.error("No token found");
      return;
    }

    try {
      // Make an API request to search for music using the provided query and token
      const response = await axios.get("http://localhost:5000/api/search", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
        params: { term: query, media: "music" }, // Parameters to send with the search request
      });

      // Set the fetched music data in the state
      setMusic(response.data.results);
    } catch (error) {
      // Handle any errors that occur while fetching the music data
      console.error("Error fetching music:", error);
      if (error.response) {
        // Log additional error details if the error response contains them
        console.log("Response error:", error.response.data);
        console.log("Status code:", error.response.status);
      }
    }
  };

  // Run fetchToken and fetchMusic when the component first mounts
  useEffect(() => {
    fetchToken(); // Generate and store the token when the app starts
    fetchMusic("top hits"); // Default search query for music when the component mounts
  }, []);

  // Handle the search form submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    if (searchTerm) {
      // Fetch music based on the user's search term
      fetchMusic(searchTerm);
    }
  };

  return (
    <div className="music-page-container">
      <div className="music-hero-section">
        <h1>Music</h1>
        <form onSubmit={handleSearch} className="music-search">
          <input
            type="text"
            placeholder="Search for music..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)} // Update search term as the user types
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="music-main-content">
        <div className="music-playlist-section">
          <h2>Favorites</h2>
          {/* Render favorites if there are any */}
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <div key={fav.trackId} className="music-fav-item">
                <img src={fav.artworkUrl100} alt={fav.trackName} />
                <p>
                  <span className="track-name">{fav.trackName}</span> -{" "}
                  <span className="artist-name">{fav.artistName}</span>
                </p>
                {/* Button to toggle the song in favorites */}
                <button onClick={() => toggleFavorite(fav)}>Remove</button>
              </div>
            ))
          ) : (
            <p>No songs added yet.</p>
          )}
        </div>

        <div className="music-grid-container">
          {/* Map through music and render each song in the grid */}
          {music.map((song) => (
            <div key={song.trackId} className="music-card">
              <img src={song.artworkUrl100} alt={song.trackName} />
              <p>
                <span className="track-name">{song.trackName}</span>
              </p>
              <p>
                <span className="artist-name">{song.artistName}</span>
              </p>
              {/* Button to add/remove song from favorites */}
              <button onClick={() => toggleFavorite(song)}>
                {favorites.some((fav) => fav.trackId === song.trackId)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Music;
