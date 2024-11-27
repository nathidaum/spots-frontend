import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Title, Button } from "@mantine/core";

import { AuthContext } from "../context/auth.context";
import SpotCard from "../components/SpotCard/SpotCard";
import PageSkeleton from "../components/PageSkeleton";
import "./explorepage.css";

function ExplorePage() {
  const [spots, setSpots] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    // Fetch spots from the backend
    axios
      .get("http://localhost:3000/spots")
      .then((response) => {
        setSpots(response.data.spots);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching spots:", error);
        setIsLoading(false);
      });

    // Fetch favorites for logged in users
    if (isLoggedIn) {
      const token = localStorage.getItem("authToken");
      if (token) {
        axios
          .get("http://localhost:3000/users/favorites", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => setFavorites(response.data.favorites || []))
          .catch((error) => {
            console.warn("Error fetching user favorites:", error.message);
          });
      }
    }
  }, [isLoggedIn]);

  const toggleFavorite = (spotId) =>
    setFavorites((prev) =>
      prev.some((fav) => fav._id === spotId)
        ? prev.filter((fav) => fav._id !== spotId)
        : [...prev, spots.find((spot) => spot._id === spotId)]
    );

  return (
    <div className="explorepage">
      <Title order={1} className="mobile-title" mb="lg">
        Discover spots
      </Title>

      {isLoading && <PageSkeleton />}

      {/* Show spots once loaded */}
      {!isLoading && (
        <div className="gallery-container">
          <div className="spotslist">
            {spots.map((spot) => (
              <SpotCard
                key={spot._id}
                spot={spot}
                isFavorite={favorites.some((fav) => fav._id === spot._id)}
                onFavoriteToggle={() => toggleFavorite(spot._id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Floating button for creating a new spot */}
      {isLoggedIn && (
        <Button className="floating-button" component={Link} to="/spots/create">
          +
        </Button>
      )}
    </div>
  );
}

export default ExplorePage;
