import { useState, useEffect } from "react";
import axios from "axios";
import { Title } from "@mantine/core";

import BookingCard from "../components/BookingCard/BookingCard";
import PageSkeleton from "../components/Skeleton";
import "./explorepage.css";
import "./bookingspage.css";

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    // Update isMobile on window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
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
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="bookingspage">
        <Title order={1} mb="lg">
          Your booked spots 🤝
        </Title>

        {/* Skeleton directly below the title */}
        {isLoading && (
        <div>
        <PageSkeleton/>
        </div>
        )}

        {!isLoading && bookings.length === 0 && (
          <p>You currently have no bookings.</p>
        )}

        {!isLoading && bookings.length > 0 && (
          <div className="booking-container">
            {bookings.map((booking) => (
              <BookingCard key={booking._id} booking={booking} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingsPage;
