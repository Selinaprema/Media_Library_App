import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styling/homepage.css";

const HomePage = () => {
  const categories = ["Movies", "Music", "Audiobooks", "Games"];
  const mediaTypes = {
    Movies: "movie",
    Music: "music",
    Audiobooks: "audiobook",
    Games: "software",
  };

  const [categoryData, setCategoryData] = useState({});
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from local storage on mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Save favorites to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Fetch the JWT token from the backend
  const fetchToken = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/api/token");
      localStorage.setItem("jwt", data.token);
      return data.token;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  };

  // Fetch category data from backend using the token
  const fetchCategoryData = async (category, token) => {
    try {
      const media = mediaTypes[category] || "all"; // Default to 'all' if no media type exists for the category
      const response = await axios.get("http://localhost:5000/api/search", {
        headers: { Authorization: `Bearer ${token}` },
        params: { term: category, media },
      });

      setCategoryData((prevData) => ({
        ...prevData,
        [category]: response.data.results, // Storing the fetched results in state
      }));
    } catch (error) {
      console.error(`Error fetching ${category} data:`, error); // Error handling
    }
  };

  // Fetch all categories when component mounts
  useEffect(() => {
    const fetchAllCategories = async () => {
      setLoading(true);
      let token = localStorage.getItem("jwt") || (await fetchToken());

      if (token) {
        await Promise.all(
          categories.map((category) => fetchCategoryData(category, token))
        );
      }

      setLoading(false);
    };

    fetchAllCategories();
  }, []);

  // Add or remove an item from favorites
  const toggleFavorite = (item) => {
    setFavorites(
      (prevFavorites) =>
        prevFavorites.some((fav) => fav.trackId === item.trackId)
          ? prevFavorites.filter((fav) => fav.trackId !== item.trackId) // Remove
          : [...prevFavorites, item] // Add
    );
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div className="hero-container">
        <h1>Welcome to the Media Library</h1>
        <p>Explore the best Movies, Music, Audiobooks, and Games</p>
      </div>

      <div className="content-container">
        {/* Favorites Section */}
        <div className="favorites-section">
          <h2>Favorites</h2>
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <div key={fav.trackId} className="fav-item">
                <img src={fav.artworkUrl100} alt={fav.trackName} />
                <p>
                  {fav.trackName} - {fav.artistName} (
                  {fav.releaseDate?.split("-")[0]})
                </p>
                <button onClick={() => toggleFavorite(fav)}>Remove</button>
              </div>
            ))
          ) : (
            <p>No items added yet.</p>
          )}
        </div>

        {/* Category Sections */}
        <div className="category-section">
          {categories.map((category) => (
            <div key={category} className="category-card">
              <h2>{category}</h2>
              <div className="category-slider">
                {!loading ? (
                  categoryData[category] &&
                  categoryData[category].length > 0 ? (
                    categoryData[category].map((item) => (
                      <div key={item.trackId} className="category-item">
                        <img
                          src={
                            item.artworkUrl100 ||
                            "https://via.placeholder.com/100"
                          }
                          alt={item.trackName}
                          className="category-image"
                        />
                        <p>{item.trackName || "No title available"}</p>
                        <p>{item.artistName || "Unknown"}</p>
                        <button onClick={() => toggleFavorite(item)}>
                          {favorites.some((fav) => fav.trackId === item.trackId)
                            ? "Remove from Favorites"
                            : "Add to Playlist"}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No items found</p>
                  )
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
