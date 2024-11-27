import { useState, useEffect } from "react";
import axios from "axios";
import { Title } from "@mantine/core";

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
        <p>You currently have no bookings.</p>
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
