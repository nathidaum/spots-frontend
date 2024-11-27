import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Text, Title } from "@mantine/core";

import PageSkeleton from "../components/PageSkeleton";
import SpotCard from "../components/SpotCard/SpotCard";
import "./explorepage.css";
import "./favoritespage.css";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch favorites from the backend
    console.log("Fetching favorites...");
    axios
      .get(`${import.meta.env.VITE_API_URL}/users/favorites`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        setFavorites(response.data.favorites || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching favorites:",
          error.response?.data || error
        );
        setFavorites([]);
        setIsLoading(false);
      });
  }, []);

  const handleFavoriteToggle = (spotId) => {
    setFavorites((prev) => prev.filter((spot) => spot._id !== spotId));
  };

  return (
    <div className="favoritespage">
      <Title order={1} mb="lg">
        Your sweet spots ✨
      </Title>

      {isLoading ? (
        <PageSkeleton />
      ) : favorites.length === 0 ? (
        <div>
          <Text mb="xl">
            No sweet spots yet. Start exploring and save your favorites.
          </Text>
          <Button
            variant="filled"
            size="md"
            color="yellow"
            component={Link}
            to="/"
          >
            Take me to the spots
          </Button>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default FavoritesPage;
