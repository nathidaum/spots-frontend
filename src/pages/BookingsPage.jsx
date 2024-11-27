import { useState, useEffect } from "react";
import axios from "axios";
import BookingCard from "../components/BookingCard/BookingCard";
import { Container, Skeleton, Title } from "@mantine/core";
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
          Your booked spots
        </Title>

        {/* Skeleton directly below the title */}
        {isLoading && (
          <div>
            {Array.from({ length: 4 }).map((_, index) => (
              <Container
                key={index}
                px={0}
                style={{
                  margin: 0,
                  display: isMobile ? "block" : "none", // Show skeletons only on mobile
                }}
              >
                <Skeleton
                  height={240}
                  radius="lg"
                  mb="lg"
                  style={{
                    width: "100%",
                  }}
                />
                <Skeleton
                  height={15}
                  radius="md"
                  mb="sm"
                  style={{
                    width: "80%",
                  }}
                />
                <Skeleton
                  height={10}
                  radius="md"
                  mb="sm"
                  style={{
                    width: "70%",
                  }}
                />
                <Skeleton
                  height={10}
                  radius="md"
                  mb="sm"
                  style={{
                    width: "20%",
                  }}
                />
              </Container>
            ))}
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
