import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import { Badge, Image, Text, Title } from "@mantine/core";

import "./bookingcard.css";
import "../SpotCard/spotcard.css";

const BookingCard = ({ booking }) => {
  const { spotId, startDate, endDate } = booking;

  if (!spotId || !spotId.images || spotId.images.length === 0) {
    return <p>Booking data is incomplete.</p>;
  }

  // Calculate the total price and number of days
  const [totalPrice, numberOfDays] = useMemo(() => {
    if (!spotId.price || !startDate || !endDate) return [0, 0];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return [days * spotId.price, days];
  }, [spotId.price, startDate, endDate]);

  const slides = spotId.images.map((url, index) => (
    <Carousel.Slide key={index}>
      <div className="image-container">
        <Image src={url} fit="cover" height={300} className="carousel-image" />
        <div className="image-overlay"></div>
      </div>
    </Carousel.Slide>
  ));

  return (
    <div className="bookingcard">
      <div className="booking-carousel-container">
        <Badge variant="default" color="yellow" className="desk-badge">
          {spotId.deskCount} desks
        </Badge>
        <Carousel withIndicators loop controlSize={24}>
          {slides}
        </Carousel>
      </div>

      <Link
        to={`/spots/${spotId._id}`} // Redirect to the spot details page
        style={{ textDecoration: "none", color: "inherit" }} // Ensure link styling doesn't affect layout
      >
        <div className="bookinginfo">
          <Title order={2} mb="xl" className="desktop-bookingdates">
            📆{" "}
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "long",
            }).format(new Date(startDate))}{" "}
            -{" "}
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "long",
            }).format(new Date(endDate))}
          </Title>

          <Title order={3} mb="xl" className="mobile-bookingdates">
            📆{" "}
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "long",
            }).format(new Date(startDate))}{" "}
            -{" "}
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "long",
            }).format(new Date(endDate))}
          </Title>

          <Text size="lg" fw={600}>
            {spotId.title || "No title available"}
          </Text>
          <Text size="lg" mb="lg">
            📍 {spotId.location?.address || "No address available"},{" "}
            {spotId.location?.city || "No city available"}
          </Text>
          <Text size="lg">
            {spotId.price || 0}€ x {numberOfDays} days
          </Text>
          <Text size="lg" fw={600}>
            Total: {totalPrice}€
          </Text>
        </div>
      </Link>
    </div>
  );
};

export default BookingCard;
