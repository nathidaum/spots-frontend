import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ActionIcon, Badge, Image } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import "@mantine/carousel/styles.css";
import {
  IconAlertCircle,
  IconHeart,
  IconHeartFilled,
} from "@tabler/icons-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import authService from "../../services/auth.service";
import "./spotcard.css";


const SpotCard = ({ spot, isFavorite, onFavoriteToggle }) => {
  // Inside SpotCard component
  const [liked, setLiked] = useState(isFavorite); // Initial favorite state

  // Sync `liked` state with `isFavorite` prop
  useEffect(() => setLiked(isFavorite), [isFavorite]);

  const handleLikeToggle = (e) => {
    e.stopPropagation(); // Prevent navigation

    if (!localStorage.getItem("authToken")) {
      // Show toaster if user is not logged in
      toast.warn("Happy you like it! Please log in to save it to your favs. 🔐", {
        position: "top-right",
        autoClose: 3000,
        icon: false,
        style: { backgroundColor: "#1C1C1C", color: "white" },
      });
      return;
    }

    authService
    .toggleFavorite(spot._id)
    .then(() => {
      setLiked((prev) => !prev);
      onFavoriteToggle?.(spot._id); // Notify parent
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
        <Badge variant="default" color="yellow" className="desk-badge">
          {spot.deskCount} desks
        </Badge>
        <Carousel
          withIndicators
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

    </div>
  );
};

export default SpotCard;
