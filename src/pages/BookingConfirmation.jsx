import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Text, Title, Skeleton } from "@mantine/core";

import BookingCard from "../components/BookingCard/BookingCard";
import "./bookingconfirmation.css";

function BookingConfirmation() {
  const { bookingId } = useParams(); // Get booking ID from route params
  const [booking, setBooking] = useState(null); // Booking details
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch the booking details by ID
    axios
      .get(`http://localhost:3000/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        setBooking(response.data.booking);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching booking details:",
          error.response?.data || error
        );
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
    <div className="bookingconfirmationpage">
      <Title order={1} mb="xl">Booking confirmed! 🎉</Title>
      <BookingCard booking={booking} />
    </div>
  );
}

export default BookingConfirmation;
