import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/users/favorites", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      .then((response) => {
        setFavorites(response.data.favorites || []);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
        setError(error.response?.data?.message || "Failed to load favorites.");
      });
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!favorites.length) {
    return <p>No favorites yet. Start exploring and save your favorites!</p>;
  }

  return (
    <div>
      <h1>Your favorite spots</h1>
      <div>
        {favorites.map((spot) => (
          <Link key={spot._id} to={`/spots/${spot._id}`}>
            <div>
              <img src={spot.images[0]} alt={spot.title} />
              <h2>{spot.title}</h2>
              <p>{spot.location.city}</p>
              <p>{spot.price} €/day</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FavoritesPage;
