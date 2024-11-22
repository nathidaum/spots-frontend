import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import { Image, ActionIcon, Notification, Box } from "@mantine/core";
import { IconHeart, IconHeartFilled, IconAlertCircle } from "@tabler/icons-react";

import "./spotcard.css";
import authService from "../../services/auth.service";

const SpotCard = ({ spot, isFavorite, onFavoriteToggle }) => {
    // Inside SpotCard component
  const [liked, setLiked] = useState(isFavorite); // Initial favorite state
  const [showNotification, setShowNotification] = useState(false);

  // Add an effect to update `liked` when `isFavorite` changes
    useEffect(() => {
    setLiked(isFavorite);
  }, [isFavorite]);

  const handleLikeToggle = (e) => {
    e.stopPropagation(); // Prevent navigation

    if (!localStorage.getItem("authToken")) {
      console.warn("You must be logged in to favorite a spot.");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    authService
      .toggleFavorite(spot._id)
      .then(() => {
        setLiked((prev) => !prev);
        if (onFavoriteToggle) onFavoriteToggle(spot._id); // Notify parent
      })
      .catch((error) => console.error("Error toggling favorite:", error));
  };

  const slides = spot.images.map((url, index) => (
    <Carousel.Slide key={index}>
      <div className="image-container">
        <Image src={url} fit="cover" height={300} className="carousel-image" />
        {/* Overlay for dark effect */}
        <div className="image-overlay"></div>
      </div>
    </Carousel.Slide>
  ));

  return (
    <div className="card">
      <div className="carousel-container">
        <Carousel
          withIndicators
          // withControls={false}
          controlSize={24}
          onMouseDown={(e) => e.stopPropagation()}
          loop
        >
          {slides}
        </Carousel>
        {/* Fixed position action icon */}
        <ActionIcon
          size="lg"
          className="heart-icon"
          onClick={handleLikeToggle}
          aria-label="Toggle favorite"
        >
          {liked ? <IconHeartFilled color="orange" /> : <IconHeart />}
        </ActionIcon>
      </div>

      <Link to={`/spots/${spot._id}`} className="spotinfo-link">
        <div className="spotinfo">
          <p className="title">{spot.title}</p>
          <p className="location">{spot.location.city}</p>
          <p className="price">€ {spot.price} per day</p>
        </div>
      </Link>

      {/* Render the notification */}
      {showNotification && (
        <Box mt="sm">
          <Notification
            color="yellow"
            icon={<IconAlertCircle size={16} />}
            onClose={() => setShowNotification(false)}
            disallowClose
          >
            You must log in to save this spot to your favorites.
          </Notification>
        </Box>
      )}
    </div>
  );
};

export default SpotCard;
