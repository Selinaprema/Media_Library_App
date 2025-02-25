import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styling/movies.css";

const Movies = ({ favorites, toggleFavorite }) => {
  // State to store fetched movie data
  const [movies, setMovies] = useState([]);
  // State to store the search term entered by the user
  const [searchTerm, setSearchTerm] = useState("");
  // State to handle loading status
  const [loading, setLoading] = useState(false);

  // Function to fetch guest token and store it in localStorage
  const fetchToken = async () => {
    try {
      // Make an API request to generate a guest token
      const response = await axios.post("http://localhost:5000/api/token");
      const token = response.data.token;
      localStorage.setItem("token", token);
    } catch (error) {
      console.error("Error generating token:", error);
    }
  };

  // Function to fetch movies from iTunes API using the token
  const fetchMovies = async (query) => {
    try {
      setLoading(true); // Set loading to true while fetching data

      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      // Make the API request to fetch movies with the provided query
      const response = await axios.get("http://localhost:5000/api/search", {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
        params: { term: query, media: "movie" }, // Parameters to send with the search request
      });

      // If there are results, shuffle and select 20 random movies
      if (response.data.results && response.data.results.length > 0) {
        setMovies(
          response.data.results.sort(() => 0.5 - Math.random()).slice(0, 20)
        );
      } else {
        console.error("No movies found in the response.");
      }

      setLoading(false); // Set loading to false after fetching data
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false); // Set loading to false even if there is an error
    }
  };

  // Fetch popular movies when the component first mounts
  useEffect(() => {
    fetchToken(); // Generate and store the token
    fetchMovies("popular"); // Default search query for popular movies
  }, []);

  // Handle search functionality
  const handleSearch = (event) => {
    event.preventDefault(); // Prevent form submission from reloading the page
    if (searchTerm) {
      fetchMovies(searchTerm); // Fetch movies based on the search term
    }
  };

  return (
    <div className="movies-page-container">
      {/* Hero Section with Search Bar */}
      <div className="movies-hero-section">
        <h1>Movies</h1>
        <form onSubmit={handleSearch} className="movies-search">
          <input
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)} // Update searchTerm as user types
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="movies-main-content">
        {/* Loading Indicator */}
        {loading && <div className="loading">Loading movies...</div>}

        {/* Favorites Section */}
        <div className="movies-playlist-section">
          <h2>Favorites</h2>
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <div key={fav.trackId} className="movies-fav-item">
                <img src={fav.artworkUrl100} alt={fav.trackName} />
                <p>{fav.trackName}</p>
                <button onClick={() => toggleFavorite(fav)}>Remove</button>
              </div>
            ))
          ) : (
            <p>No movies added yet.</p>
          )}
        </div>

        {/* Movies Grid Section */}
        <div className="movies-grid-container">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie.trackId} className="movies-card">
                <img src={movie.artworkUrl100} alt={movie.trackName} />
                <p>{movie.trackName}</p>
                <button onClick={() => toggleFavorite(movie)}>
                  {favorites.some((fav) => fav.trackId === movie.trackId)
                    ? "Remove from Favorites"
                    : "Add to Favorites"}
                </button>
              </div>
            ))
          ) : (
            <p>No movies found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Movies;
