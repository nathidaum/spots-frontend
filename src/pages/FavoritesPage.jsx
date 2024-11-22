import { useState, useEffect } from "react";
import axios from "axios";
import SpotCard from "../components/SpotCard/SpotCard";
import "./explorepage.css";
import "./favoritespage.css";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/favorites", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        setFavorites(response.data.favorites || []);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
        setError(error.response?.data?.message || "Failed to load favorites.");
      });
  }, []);

  const handleFavoriteToggle = (spotId) => {
    setFavorites((prev) => prev.filter((spot) => spot._id !== spotId)); // Remove spot from local state
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!favorites.length) {
    return <p>No favorites yet. Start exploring and save your favorites!</p>;
  }

  return (
    <div className="favoritespage">
      <h1 className="mobile-title">Your sweet spots</h1>
      <div className="gallery-container">
        <div className="spotslist">
          {favorites.map((spot) => (
            <SpotCard
              key={spot._id}
              spot={spot}
              isFavorite={true}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FavoritesPage;
