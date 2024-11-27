import { Button, Text } from "@mantine/core";
import "./Spotcard/spotcard.css";
import "../pages/spotdetailspage.css";

const StickyBookingFooter = ({
  spot,
  startDate,
  endDate,
  totalPrice,
  handleBookingSubmit,
}) => {
  if (!spot) return null; // Early return if no spot data is available

  return (
    <div className="sticky-footer">
      <div className="price-info">
        {/* Display price per day or total price based on date selection */}
        {(!startDate || !endDate) ? (
          <Text fw={600} size="lg">
            {spot.price} € / day
          </Text>
        ) : (
          <>
            <Text fw={600} size="lg">
              {totalPrice}€
            </Text>
            <Text size="sm" color="dimmed">
              {`${new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
              }).format(startDate)} to ${new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
              }).format(endDate)}`}
            </Text>
          </>
        )}
      </div>

      {/* Booking button */}
      <Button
        color="yellow"
        size="lg"
        onClick={handleBookingSubmit}
        disabled={!startDate || !endDate}
      >
        Book
      </Button>
    </div>
  );
};

export default StickyBookingFooter;