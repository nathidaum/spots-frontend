import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Text, Title, Button, Skeleton } from "@mantine/core";

function BookingConfirmation() {
  const { bookingId } = useParams(); // Get booking ID from route params
  const [booking, setBooking] = useState(null); // Booking details
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch the booking details by ID
    axios
      .get(`http://localhost:3000/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      })
      .then((response) => {
        setBooking(response.data.booking);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching booking details:", error.response?.data || error);
        setIsLoading(false);
      });
  }, [bookingId]);

  if (isLoading) {
    return <Skeleton height={300} />;
  }

  if (!booking) {
    return <Text color="red">Error: Unable to fetch booking details.</Text>;
  }

  return (
    <div>
      <Title order={1}>Booking Confirmed!</Title>
      <Text mt="sm">
        Your booking from{" "}
        <strong>{new Date(booking.startDate).toLocaleDateString()}</strong> to{" "}
        <strong>{new Date(booking.endDate).toLocaleDateString()}</strong> has been confirmed.
      </Text>
      <Text mt="sm">Spot: {booking.spotId.title}</Text>
      <Text mt="sm">Location: {booking.spotId.location.city}, {booking.spotId.location.address}</Text>

      <Button mt="lg" component={Link} to="/bookings">
        View All Bookings
      </Button>
    </div>
  );
}

export default BookingConfirmation;
