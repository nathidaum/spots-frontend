import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import { Image, ActionIcon } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

import "./spotcard.css";
import authService from "../../services/auth.service";

const SpotCard = ({ spot, isFavorite, onFavoriteToggle }) => {
  // Inside SpotCard component
  const [liked, setLiked] = useState(isFavorite); // Initial favorite state

  // Add an effect to update `liked` when `isFavorite` changes
  useEffect(() => {
    setLiked(isFavorite);
  }, [isFavorite]);

  const handleLikeToggle = (e) => {
    e.stopPropagation(); // Prevent navigation

    if (!localStorage.getItem("authToken")) {
      console.warn("You must be logged in to favorite a spot.");
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
    <div className="spotcard">
      {/* Carousel container */}
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
          className="hear-icon"
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
    </div>
  );
};

export default SpotCard;
