import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Text, Title, Button, Skeleton } from "@mantine/core";

import "./bookingconfirmation.css";
import SpotCard from "../components/SpotCard/SpotCard";

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

  const spot = booking.spotId;

  return (
      <div className="bookingconfirmationpage">
        <Title order={1} m={0}>Booking confirmed!</Title>
        <Text mt="sm" mb="xl">
          Your booking from{" "}
          <strong>
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "long",
            }).format(new Date(booking.startDate))}
          </strong>{" "}
          to{" "}
          <strong>
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "long",
            }).format(new Date(booking.endDate))}
          </strong>{" "}
          has been confirmed.
        </Text>
        <SpotCard spot={spot} />
      </div>
  );
}

export default BookingConfirmation;
