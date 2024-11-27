import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Text, Title } from "@mantine/core";

import BookingCard from "../components/BookingCard/BookingCard";
import PageSkeleton from "../components/PageSkeleton";
import "./explorepage.css";
import "./bookingspage.css";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch bookings from the backend
    axios
      .get("http://localhost:3000/bookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((response) => {
        setBookings(response.data.bookings || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setBookings([]); // Ensure bookings state is reset on error
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="bookingspage">
      <Title order={1} mb="lg">
        Your booked spots 🤝
      </Title>

      {isLoading ? (
        <PageSkeleton />
      ) : bookings.length === 0 ? (
        <div>
          <Text mb="xl">
            You don't have bookings yet. Time to spot your spot!
          </Text>
          <Button
            variant="filled"
            size="md"
            color="yellow"
            component={Link}
            to="/"
          >
            Take me to the spots
          </Button>
        </div>
      ) : (
        <div className="booking-container">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;
