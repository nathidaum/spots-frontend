import { useState } from "react";
import { Link } from "react-router-dom";
import "@mantine/carousel/styles.css";
import { Carousel } from "@mantine/carousel";
import { Image, ActionIcon } from "@mantine/core";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

import "./spotcard.css";

const SpotCard = ({ spot }) => {
  const [liked, setLiked] = useState(false);

  const handleLikeToggle = (e) => {
    e.stopPropagation(); // Prevent Link navigation
    setLiked((prev) => !prev);
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
        <ActionIcon size="lg" className="hear-icon" onClick={handleLikeToggle}>
          {liked ? <IconHeartFilled color="white" /> : <IconHeart />}
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
