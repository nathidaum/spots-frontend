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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
  const { isLoggedIn } = useContext(AuthContext);

  const handleSpotCreated = (newSpot) => {
    setSpots((prevSpots) => [newSpot, ...prevSpots]); // Add new spot to the top
  };

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
            // Optional: Clear token from localStorage if it's invalid
            if (error.response?.status === 401) {
              localStorage.removeItem("authToken");
            }
          });
      }
    }
  }, [isLoggedIn]);

  return (
    <div className="explorepage">
      <Title order={1} className="mobile-title" mb="lg">
        Discover spots
      </Title>

      {/* Skeleton directly below the title */}
      {isLoading && isMobile && (
        <div>
        <PageSkeleton/>
        </div>
      )}

      {/* Show spots once loaded */}
      {!isLoading && (
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
                      : [spot, ...prev]
                  );
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Floating button for creating a new spot */}
      {isLoggedIn && (
        <Button
          className="floating-button"
          component={Link}
          to={{
            pathname: "/spots/create",
            state: { handleSpotCreated },
          }}
        >
          +
        </Button>
      )}
    </div>
  );
}

export default ExplorePage;
