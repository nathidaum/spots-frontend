import { Carousel } from "@mantine/carousel";
import { Image } from "@mantine/core";
import "./bookingcard.css";
import "../SpotCard/spotcard.css";

const BookingCard = ({ booking }) => {
  // Check if `spotId` and its `images` exist
  if (!booking.spotId || !booking.spotId.images || booking.spotId.images.length === 0) {
    return <p>Booking data is incomplete.</p>;
  }

  const slides = booking.spotId.images.map((url, index) => (
    <Carousel.Slide key={index}>
      <div className="image-container">
        <Image src={url} fit="cover" height={300} className="carousel-image" />
        <div className="image-overlay"></div>
      </div>
    </Carousel.Slide>
  ));

  return (
    <div className="spotcard">
      <div className="carousel-container">
        <Carousel withIndicators loop controlSize={24}>
          {slides}
        </Carousel>
      </div>

      <div className="spotinfo">
        <p className="title">{booking.spotId.title || "No title available"}</p>
        <p className="location">
          {booking.spotId.location?.address || "No address available"},{" "}
          {booking.spotId.location?.city || "No city available"}
        </p>
        <p className="price">
          Dates: {new Date(booking.startDate).toLocaleDateString()} -{" "}
          {new Date(booking.endDate).toLocaleDateString()}
        </p>
        <p className="price">€{booking.spotId.price || 0} per day</p>
      </div>
    </div>
  );
};

export default BookingCard;
