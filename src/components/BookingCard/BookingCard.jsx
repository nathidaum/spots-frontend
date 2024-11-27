import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Carousel } from "@mantine/carousel";
import { Badge, Image, Text, Title } from "@mantine/core";
import "./bookingcard.css";
import "../SpotCard/spotcard.css";


const BookingCard = ({ booking }) => {
  // Check if `spotId` and its `images` exist
  if (
    !booking.spotId ||
    !booking.spotId.images ||
    booking.spotId.images.length === 0
  ) {
    return <p>Booking data is incomplete.</p>;
  }

  // Calculate the total price
  const totalPrice = useMemo(() => {
    if (!booking.spotId.price || !booking.startDate || !booking.endDate)
      return 0;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);

    // Calculate the difference in days (inclusive)
    const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return diffInDays * booking.spotId.price;
  }, [booking]);

  // Calculate the number of days
  const numberOfDays = useMemo(() => {
    if (!booking.startDate || !booking.endDate) return 0;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);

    // Calculate the difference in days (inclusive)
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  }, [booking]);

  const slides = booking.spotId.images.map((url, index) => (
    <Carousel.Slide key={index}>
      <div className="image-container">
        <Image src={url} fit="cover" height={300} className="carousel-image" />
        <div className="image-overlay"></div>
      </div>
    </Carousel.Slide>
  ));

  return (
    <Link
      to={`/spots/${booking.spotId._id}`} // Redirect to the spot details page
      style={{ textDecoration: "none", color: "inherit" }} // Ensure link styling doesn't affect layout
    >
    <div className="bookingcard">
      <div className="booking-carousel-container">
        <Badge variant="default" color="yellow" className="desk-badge">
          {booking.spotId.deskCount} desks
        </Badge>
        <Carousel withIndicators loop controlSize={24}>
          {slides}
        </Carousel>
      </div>

      <div className="bookinginfo">
        <Title order={2} mb="xl">
          📆{" "}
          {new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
          }).format(new Date(booking.startDate))}{" "}
          -{" "}
          {new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "long",
          }).format(new Date(booking.endDate))}
        </Title>
        <Text size="lg" fw={600}>
          {booking.spotId.title || "No title available"}
        </Text>
        <Text size="lg" mb="lg">
          📍 {booking.spotId.location?.address || "No address available"},{" "}
          {booking.spotId.location?.city || "No city available"}
        </Text>
        <Text size="lg">
          {booking.spotId.price || 0}€ x {numberOfDays} days
        </Text>
        <Text size="lg" fw={600}>
          Total: {totalPrice}€
        </Text>
      </div>
    </div>
    </Link>
  );
};

export default BookingCard;
