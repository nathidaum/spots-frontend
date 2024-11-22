import { useState, useEffect } from "react";
import axios from "axios";

import SpotCard from "../components/SpotCard/SpotCard";
import "./explorepage.css";

function ExplorePage() {
  const [spots, setSpots] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Fetch spots from the backend
    axios
      .get("http://localhost:3000/spots")
      .then((response) => setSpots(response.data.spots))
      .catch((error) => console.error("Error fetching spots:", error));

    // Fetch user favorites
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("http://localhost:3000/users/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setFavorites(response.data.favorites || []))
        .catch((error) =>
          console.error("Error fetching user favorites:", error)
        );
    }
  }, []);

  return (
    <div className="explorepage">
      <h1 className="mobile-title">Discover new spots</h1>
      <div className="gallery-container">
        <div className="spotslist">
          {spots.map((spot) => (
            <SpotCard
            key={spot._id}
            spot={spot}
            isFavorite={favorites.some((fav) => fav._id === spot._id)} // Dynamically check favorites
            onFavoriteToggle={() => {
              setFavorites((prev) =>
                prev.some((fav) => fav._id === spot._id)
                  ? prev.filter((fav) => fav._id !== spot._id) // Remove if already in favorites
                  : [...prev, spot] // Add if not in favorites
              );
            }}
          />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExplorePage;
