import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styling/audiobooks.css";

const Audiobooks = ({ favorites, toggleFavorite }) => {
  const [audiobooks, setAudiobooks] = useState([]); // State to store the audiobooks data
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term entered by the user

  // Fetch guest token and save it to localStorage
  const fetchToken = async () => {
    try {
      // Make an API request to generate a guest token
      const response = await axios.post("http://localhost:5000/api/token");
      const token = response.data.token;
      // Store the token in localStorage
      localStorage.setItem("token", token);
    } catch (error) {
      // Handle error if token generation fails
      console.error("Error generating token:", error);
    }
  };

  // Fetch audiobooks based on the search query
  const fetchAudiobooks = async (query) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token is found, display an error and return
      console.error("No token found");
      return;
    }

    try {
      // Make an API request to search for audiobooks using the query and token
      const response = await axios.get("http://localhost:5000/api/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { term: query, media: "audiobook" },
      });

      // Set the fetched audiobooks data in the state
      setAudiobooks(response.data.results);
    } catch (error) {
      // Handle any errors that occur while fetching the audiobooks data
      console.error("Error fetching audiobooks:", error);
      if (error.response) {
        // Log additional error details if the error response contains them
        console.log("Response error:", error.response.data);
        console.log("Status code:", error.response.status);
      }
    }
  };

  // Run fetchToken and fetchAudiobooks when the component first mounts
  useEffect(() => {
    fetchToken(); // Generate and store the token when the app starts
    fetchAudiobooks("bestsellers"); // Default search query for audiobooks when the component mounts
  }, []);

  // Handle the search form submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    if (searchTerm) {
      // Fetch audiobooks based on the user's search term
      fetchAudiobooks(searchTerm);
    }
  };

  return (
    <div className="audiobooks-container">
      <div className="audiobooks-hero">
        <h1>Audiobooks</h1>
        <form onSubmit={handleSearch} className="audiobooks-search">
          <input
            type="text"
            placeholder="Search for audiobooks..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)} // Update search term as the user types
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="audiobooks-content">
        {/* Favorites Section */}
        <div className="audiobooks-favorites">
          <h2>Favorites</h2>

          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <div key={fav.collectionId} className="fav-item">
                <img src={fav.artworkUrl100} alt={fav.collectionName} />
                <p>
                  <span className="book-title">{fav.collectionName}</span> -{" "}
                  <span className="artist-name">{fav.artistName}</span>
                </p>
                {/* Button to toggle the audiobook in favorites */}
                <button onClick={() => toggleFavorite(fav)}>Remove</button>
              </div>
            ))
          ) : (
            <p>No audiobooks added yet.</p>
          )}
        </div>

        {/* Audiobooks Grid */}
        <div className="audiobooks-grid">
          {/* Map through audiobooks and render each one in the grid */}
          {audiobooks.map((book) => (
            <div key={book.collectionId} className="audiobook-card">
              <img src={book.artworkUrl100} alt={book.collectionName} />
              <p>
                <span className="book-title">{book.collectionName}</span>
              </p>
              <p>
                <span className="artist-name">{book.artistName}</span>
              </p>
              {/* Button to add/remove audiobook from favorites */}
              <button onClick={() => toggleFavorite(book)}>
                {favorites.some((fav) => fav.collectionId === book.collectionId)
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

export default Audiobooks;
