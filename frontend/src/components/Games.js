import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styling/games.css";

const Games = ({ favorites, toggleFavorite }) => {
  const [games, setGames] = useState([]); // State to store the fetched games data
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term entered by the user

  // Fetch guest token and save it to localStorage
  const fetchToken = async () => {
    try {
      // Make an API request to generate a guest token from the backend
      const response = await axios.post("http://localhost:5000/api/token");
      const token = response.data.token;
      // Store the generated token in localStorage
      localStorage.setItem("token", token);
    } catch (error) {
      // Handle error if token generation fails
      console.error("Error generating token:", error);
    }
  };

  // Fetch games based on the search query
  const fetchGames = async (query) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token is found, display an error and return
      console.error("No token found");
      return;
    }

    try {
      // Make an API request to search for games using the query and token
      const response = await axios.get("http://localhost:5000/api/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { term: query, media: "software" },
      });

      // Set the fetched games data in the state
      setGames(response.data.results);
    } catch (error) {
      // Handle any errors that occur while fetching the games data
      console.error("Error fetching games:", error);
      if (error.response) {
        // Log additional error details if the error response contains them
        console.log("Response error:", error.response.data);
        console.log("Status code:", error.response.status);
      }
    }
  };

  // Run fetchToken and fetchGames when the component first mounts
  useEffect(() => {
    fetchToken(); // Generate and store the token when the app starts
    fetchGames("popular games"); // Default search query for games when the component mounts
  }, []);

  // Handle the search form submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    if (searchTerm) {
      // Fetch games based on the user's search term
      fetchGames(searchTerm);
    }
  };

  return (
    <div className="games-page">
      {/* Hero Section with the Search Bar */}
      <div className="games-hero-section">
        <h1>Games</h1>
        <form onSubmit={handleSearch} className="Games-search">
          {/* Input field for searching games */}
          <input
            type="text"
            placeholder="Search for games..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)} // Update search term as the user types
          />
          {/* Submit button for triggering search */}
          <button type="submit">Search</button>
        </form>
      </div>

      {/* Main Content Section */}
      <div className="games-content">
        {/* Favorites Section */}
        <div className="games-favorites-section">
          <h2>Favorites</h2>
          {/* Render the list of favorites if there are any */}
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <div key={fav.trackId} className="games-fav-item">
                {/* Display the artwork and name of the favorite game */}
                <img src={fav.artworkUrl100} alt={fav.trackName} />
                <p>{fav.trackName}</p>
                {/* Button to remove the game from favorites */}
                <button onClick={() => toggleFavorite(fav)}>Remove</button>
              </div>
            ))
          ) : (
            // If there are no favorites, display a message
            <p>No games added yet.</p>
          )}
        </div>

        {/* Games Grid Section */}
        <div className="games-grid">
          {/* Render the list of games fetched from the search */}
          {games.map((game) => (
            <div key={game.trackId} className="games-card">
              {/* Display the artwork and name of the game */}
              <img src={game.artworkUrl100} alt={game.trackName} />
              <p>{game.trackName}</p>
              {/* Button to toggle the game in favorites (either add or remove) */}
              <button onClick={() => toggleFavorite(game)}>
                {favorites.some((fav) => fav.trackId === game.trackId)
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

export default Games;
