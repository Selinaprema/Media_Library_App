import React from "react";

const FavouritesSection = ({ favorites, toggleFavorite }) => {
  return (
    <div className="favourites-section">
      <h2>Favourites</h2>

      {/*  Display Message if No Favorites Exist */}
      {favorites.length === 0 ? (
        <p>No favourites added yet</p>
      ) : (
        <div className="favourites-grid">
          {/* Render Favorite Items */}
          {favorites.map((item) => (
            <div
              key={item.trackId || item.collectionId}
              className="favourite-item"
            >
              <img
                src={item.artworkUrl100}
                alt={item.trackName || item.collectionName}
              />
              <p>{item.trackName || item.collectionName}</p>
              <button onClick={() => toggleFavorite(item)}>
                Remove from Favourites
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouritesSection;
