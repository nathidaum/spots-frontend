import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Skeleton, Title } from "@mantine/core";
import SpotCard from "../components/SpotCard/SpotCard";
import "./explorepage.css";
import "./favoritespage.css";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    // Update isMobile on window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("Fetching favorites...");
    axios
      .get("http://localhost:3000/users/favorites", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        console.log("Favorites fetched:", response.data.favorites);
        setFavorites(response.data.favorites || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
        setError(error.response?.data?.message || "Failed to load favorites.");
        setIsLoading(false);
      });
  }, []);

  const handleFavoriteToggle = (spotId) => {
    setFavorites((prev) => prev.filter((spot) => spot._id !== spotId));
  };

  console.log("Loading state:", isLoading);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="favoritespage">
      <Title order={1} mb="lg">
        Your sweet spots ✨
      </Title>

      {/* Skeleton directly below the title */}
      {isLoading && (
        <div>
          {Array.from({ length: 4 }).map((_, index) => (
            <Container
              key={index}
              px={0}
              style={{
                margin: 0,
                display: isMobile ? "block" : "none", // Only display skeletons on mobile
              }}
            >
              <Skeleton
                height={240}
                radius="lg"
                mb="lg"
                style={{
                  width: "100%",
                }}
              />
              <Skeleton
                height={15}
                radius="md"
                mb="sm"
                style={{
                  width: "80%",
                }}
              />
              <Skeleton
                height={10}
                radius="md"
                mb="sm"
                style={{
                  width: "70%",
                }}
              />
              <Skeleton
                height={10}
                radius="md"
                mb="sm"
                style={{
                  width: "20%",
                }}
              />
            </Container>
          ))}
        </div>
      )}

      {/* Show Empty State */}
      {!isLoading && favorites.length === 0 && (
        <p>No favorites yet. Start exploring and save your favorites!</p>
      )}

      {/* Show Favorites */}
      {!isLoading && favorites.length > 0 && (
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
