import { DateInput, Button, Text, Title, Divider } from "@mantine/core";
import "./SpotCard/spotcard.css";
import "../pages/spotdetailspage.css";

const BookingBox = ({
  excludeDate,
  handleBookingSubmit,
  numberOfDays,
  setEndDate,
  setStartDate,
  startDate,
  endDate,
  spot,
  totalPrice,
}) => {
  return (
    <div className="booking-box">
      {/* Spot Price */}
      <Title size="md" mt="ld" mb="lg">
        <span className="priceperday">{spot.price}</span> € / day
      </Title>

      {/* Date Selection */}
      <div className="date-selection-desktop">
        <DateInput
          mr={10}
          radius={10}
          value={startDate}
          onChange={(date) => {
            setStartDate(date);
            if (endDate && date > endDate) setEndDate(null); // Reset end date if invalid
          }}
          placeholder="Start Date"
          minDate={new Date()}
          excludeDate={excludeDate}
          label="Start Date"
          withAsterisk
          styles={{
            input: {
              backgroundColor: "white",
            },
            day: (modifiers) => ({
              backgroundColor: modifiers.disabled ? "#f0f0f0" : undefined,
              color: modifiers.disabled ? "#b0b0b0" : undefined,
              pointerEvents: modifiers.disabled ? "none" : undefined,
            }),
          }}
        />
        <DateInput
          mr={10}
          radius={10}
          value={endDate}
          onChange={setEndDate}
          placeholder="End Date"
          minDate={startDate || new Date()} // End date must be after start date
          excludeDate={excludeDate}
          label="End Date"
          withAsterisk
          styles={{
            input: {
              backgroundColor: "white",
            },
            day: (modifiers) => ({
              backgroundColor: modifiers.disabled ? "#f0f0f0" : undefined,
              color: modifiers.disabled ? "#b0b0b0" : undefined,
              pointerEvents: modifiers.disabled ? "none" : undefined,
            }),
          }}
        />
      </div>

      {/* Price Calculation */}
      {startDate && endDate && (
        <>
          <Divider my="md" />
          <div className="price-calc">
            <Text fw={400} size="md" mt="sm" c="grey">
              {spot.price}€ x {numberOfDays} days
            </Text>
            <Text fw={800} size="lg" mt="sm" c="black">
              {totalPrice}€
            </Text>
          </div>
        </>
      )}

      {/* Book Button */}
      <Button
        color="yellow"
        size="md"
        mt="lg"
        className="desktop-booking-button"
        onClick={handleBookingSubmit}
        disabled={!startDate || !endDate}
      >
        Book
      </Button>
    </div>
  );
};

export default BookingBox;